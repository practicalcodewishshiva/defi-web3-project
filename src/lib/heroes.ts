import { Hero } from './gameStore';
import heroKnight from '@/assets/hero-knight.png';
import heroArcher from '@/assets/hero-archer.png';
import heroMage from '@/assets/hero-mage.png';

export const HEROES: Hero[] = [
  {
    id: 'guardian-knight',
    name: 'Guardian Knight',
    class: 'Tank',
    attack: 70,
    defense: 95,
    speed: 50,
    image: heroKnight,
  },
  {
    id: 'storm-archer',
    name: 'Storm Archer',
    class: 'Ranged',
    attack: 85,
    defense: 55,
    speed: 90,
    image: heroArcher,
  },
  {
    id: 'arcane-mage',
    name: 'Arcane Mage',
    class: 'Caster',
    attack: 95,
    defense: 45,
    speed: 70,
    image: heroMage,
  },
];
