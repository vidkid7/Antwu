import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  BookOpen,
  BusFront,
  Check,
  ChevronDown,
  Facebook,
  CircleUserRound,
  Clock3,
  FileText,
  Flag,
  Handshake,
  Heart,
  Instagram,
  Landmark,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  MonitorPlay,
  MoveRight,
  Linkedin,
  Phone,
  PlayCircle,
  Search,
  Send,
  Settings2,
  ShieldCheck,
  Sparkles,
  UsersRound,
  X,
  Youtube,
} from 'lucide-react';
import type { IconName } from '@/lib/types';

export const iconMap = { shield: ShieldCheck, eye: CircleUserRound, flag: Flag, users: UsersRound, heart: Heart, book: BookOpen, megaphone: MessageCircle, bus: BusFront, map: MapPin, handshake: Handshake } as const;

export function Icon({ name, size = 18, strokeWidth = 1.7 }: { name: IconName; size?: number; strokeWidth?: number }) {
  const Component = iconMap[name];
  return <Component size={size} strokeWidth={strokeWidth} aria-hidden="true" />;
}

export { ArrowLeft, ArrowRight, BarChart3, BookOpen, Check, ChevronDown, Clock3, Facebook, FileText, Instagram, Landmark, Linkedin, Mail, MapPin, Menu, MessageCircle, MonitorPlay, MoveRight, Phone, PlayCircle, Search, Send, Settings2, ShieldCheck, Sparkles, UsersRound, X, Youtube };
