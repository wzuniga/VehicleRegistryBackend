import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity({ name: 'pending_car_plates', schema: 'public' })
export class PendingCarPlate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 10 })
  plate: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: () => 'now()' })
  createdAt: Date;

  @Column({ name: 'a_is_loaded', type: 'boolean', default: false, nullable: true })
  aIsLoaded: boolean;

  @Column({ name: 'a_search_attempts', type: 'int4', default: 0 })
  aSearchAttempts: number;

  @Column({ name: 'b_is_loaded', type: 'boolean', default: false, nullable: true })
  bIsLoaded: boolean;

  @Column({ name: 'b_search_attempts', type: 'int4', default: 0 })
  bSearchAttempts: number;

  @Column({ name: 'c_is_loaded', type: 'boolean', default: false, nullable: true })
  cIsLoaded: boolean;

  @Column({ name: 'c_search_attempts', type: 'int4', default: 0 })
  cSearchAttempts: number;

  @Column({ name: 'd_is_loaded', type: 'boolean', default: false, nullable: true })
  dIsLoaded: boolean;

  @Column({ name: 'd_search_attempts', type: 'int4', default: 0 })
  dSearchAttempts: number;

  @Column({ name: 'e_is_loaded', type: 'boolean', default: false, nullable: true })
  eIsLoaded: boolean;

  @Column({ name: 'e_search_attempts', type: 'int4', default: 0 })
  eSearchAttempts: number;

  @Column({ name: 'f_is_loaded', type: 'boolean', default: false, nullable: true })
  fIsLoaded: boolean;

  @Column({ name: 'f_search_attempts', type: 'int4', default: 0 })
  fSearchAttempts: number;

  @Column({ name: 'g_is_loaded', type: 'boolean', default: false, nullable: true })
  gIsLoaded: boolean;

  @Column({ name: 'g_search_attempts', type: 'int4', default: 0 })
  gSearchAttempts: number;

  @Column({ name: 'h_is_loaded', type: 'boolean', default: false, nullable: true })
  hIsLoaded: boolean;

  @Column({ name: 'h_search_attempts', type: 'int4', default: 0 })
  hSearchAttempts: number;

  @Column({ name: 'i_is_loaded', type: 'boolean', default: false, nullable: true })
  iIsLoaded: boolean;

  @Column({ name: 'i_search_attempts', type: 'int4', default: 0 })
  iSearchAttempts: number;

  @Column({ name: 'j_is_loaded', type: 'boolean', default: false, nullable: true })
  jIsLoaded: boolean;

  @Column({ name: 'j_search_attempts', type: 'int4', default: 0 })
  jSearchAttempts: number;

  @Column({ name: 'k_is_loaded', type: 'boolean', default: false, nullable: true })
  kIsLoaded: boolean;

  @Column({ name: 'k_search_attempts', type: 'int4', default: 0 })
  kSearchAttempts: number;

  @Column({ name: 'l_is_loaded', type: 'boolean', default: false, nullable: true })
  lIsLoaded: boolean;

  @Column({ name: 'l_search_attempts', type: 'int4', default: 0 })
  lSearchAttempts: number;

  @Column({ name: 'm_is_loaded', type: 'boolean', default: false, nullable: true })
  mIsLoaded: boolean;

  @Column({ name: 'm_search_attempts', type: 'int4', default: 0 })
  mSearchAttempts: number;
}
