import { Injectable, UnauthorizedException, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { User, UserRole } from './entities/user.entity';
import { CreditTransaction } from './entities/credit-transaction.entity';
import { Invitation } from './entities/invitation.entity';
import { MailService } from './mail.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(CreditTransaction)
    private creditTxRepository: Repository<CreditTransaction>,
    @InjectRepository(Invitation)
    private invitationsRepository: Repository<Invitation>,
    private jwtService: JwtService,
    private configService: ConfigService,
    private mailService: MailService,
  ) {}

  private buildToken(user: User): string {
    const payload = { sub: user.id, email: user.email, name: user.name, role: user.role };
    return this.jwtService.sign(payload);
  }

  private async isFirstUser(): Promise<boolean> {
    const count = await this.usersRepository.count();
    return count === 0;
  }

  private async giveRegistrationBonus(user: User): Promise<void> {
    const bonus = Number(this.configService.get('REGISTRATION_BONUS_CREDITS') ?? 5);
    await this.usersRepository.update(user.id, { credits: user.credits + bonus });
    await this.creditTxRepository.save(
      this.creditTxRepository.create({ userId: String(user.id), amount: bonus, reason: 'REGISTRATION_BONUS' }),
    );
  }

  async register(dto: RegisterDto) {
    const existing = await this.usersRepository.findOne({ where: { email: dto.email } });
    if (existing) throw new UnauthorizedException('Email ya registrado');

    const role = (await this.isFirstUser()) ? UserRole.ADMIN : UserRole.CLIENT;
    const hashed = await bcrypt.hash(dto.password, 10);
    const user = await this.usersRepository.save(
      this.usersRepository.create({ email: dto.email, username: dto.email, password: hashed, name: dto.name, role }),
    );
    await this.giveRegistrationBonus(user);

    // Apply invitation credits if exists
    const invitation = await this.invitationsRepository.findOne({ where: { email: dto.email, used: false } });
    if (invitation) {
      await this.usersRepository.update(user.id, { credits: user.credits + Number(this.configService.get('REGISTRATION_BONUS_CREDITS') ?? 5) + invitation.credits });
      await this.creditTxRepository.save(
        this.creditTxRepository.create({ userId: String(user.id), amount: invitation.credits, reason: 'INVITATION_BONUS' }),
      );
      await this.invitationsRepository.update(invitation.id, { used: true });
    }

    const saved = await this.usersRepository.findOne({ where: { id: user.id } });
    return this.sanitize(saved);
  }

  async login(dto: LoginDto) {
    const user = await this.usersRepository.findOne({ where: { email: dto.email } });
    if (!user) throw new UnauthorizedException('Credenciales inválidas');
    if (!user.password) throw new UnauthorizedException('Esta cuenta usa Google. Inicia sesión con Google.');
    const matched = await bcrypt.compare(dto.password, user.password);
    if (!matched) throw new UnauthorizedException('Credenciales inválidas');
    return { access_token: this.buildToken(user), user: this.sanitize(user) };
  }

  async findOrCreateGoogleUser(profile: any): Promise<User> {
    const email = profile.emails?.[0]?.value;
    const googleId = profile.id;
    const name = profile.displayName ||
      `${profile.name?.givenName ?? ''} ${profile.name?.familyName ?? ''}`.trim();

    let user = await this.usersRepository.findOne({ where: { googleId } });
    if (!user && email) user = await this.usersRepository.findOne({ where: { email } });

    if (user) {
      if (!user.googleId) await this.usersRepository.update(user.id, { googleId });
      return this.usersRepository.findOne({ where: { id: user.id } });
    }

    const role = (await this.isFirstUser()) ? UserRole.ADMIN : UserRole.CLIENT;
    const newUser = await this.usersRepository.save(
      this.usersRepository.create({ email, username: email, googleId, name, role }),
    );    await this.giveRegistrationBonus(newUser);
    return this.usersRepository.findOne({ where: { id: newUser.id } });
  }

  async getProfile(userId: string) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return this.sanitize(user);
  }

  async getCreditHistory(userId: string) {
    return this.creditTxRepository.find({ where: { userId: String(userId) }, order: { createdAt: 'DESC' } });
  }

  async grantCredits(adminId: number | string, targetEmail: string, amount: number) {
    const user = await this.usersRepository.findOne({ where: { email: targetEmail } });
    if (!user) throw new NotFoundException(`No existe un usuario con el correo ${targetEmail}`);
    const newCredits = user.credits + amount;
    await this.usersRepository.update(user.id, { credits: newCredits });
    await this.creditTxRepository.save(
      this.creditTxRepository.create({ userId: String(user.id), amount, reason: 'ADMIN_GRANT', grantedByAdminId: String(adminId) }),
    );
    return { message: `${amount} créditos otorgados a ${targetEmail}`, newBalance: newCredits };
  }

  async preregister(adminId: number | string, targetEmail: string) {
    const existing = await this.usersRepository.findOne({ where: { email: targetEmail } });
    if (existing) throw new ConflictException(`El correo ${targetEmail} ya tiene una cuenta registrada`);

    const registerUrl = `${this.configService.get('FRONTEND_URL')}/register`;
    await this.mailService.sendPreregistrationEmail(targetEmail, registerUrl);

    // Upsert invitation
    const existing_inv = await this.invitationsRepository.findOne({ where: { email: targetEmail } });
    if (existing_inv) {
      await this.invitationsRepository.update(existing_inv.id, { used: false, credits: 15 });
    } else {
      await this.invitationsRepository.save(
        this.invitationsRepository.create({ email: targetEmail, credits: 15 }),
      );
    }

    return { message: `Invitación enviada a ${targetEmail}` };
  }

  async getUsersList() {
    const users = await this.usersRepository.find({ order: { createdAt: 'DESC' } });
    return users.map(u => this.sanitize(u));
  }

  private sanitize(user: User) {
    const { password, googleId, ...rest } = user as any;
    return rest;
  }
}
