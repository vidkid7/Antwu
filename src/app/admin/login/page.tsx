'use client';

import Link from 'next/link';
import { useState, type FormEvent } from 'react';
import { ArrowLeft, ArrowRight, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { BrandLockup } from '@/components/logo';
import { useLanguage } from '@/components/language';

export default function AdminLoginPage() {
  const { lang, setLang } = useLanguage();
  const t = (en: string, ne: string) => lang === 'ne' ? ne : en;
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [visible, setVisible] = useState(false);
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setError(''); setBusy(true); const form = new FormData(event.currentTarget);
    try { const response = await fetch('/api/auth/login', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: form.get('email'), password: form.get('password') }) }); const result = await response.json(); if (!response.ok) throw new Error(result.error || t('Sign in failed. Please try again.', 'लगइन असफल भयो। पुनः प्रयास गर्नुहोस्।')); window.location.assign('/admin'); } catch (err) { setError(err instanceof Error ? err.message : t('Could not connect. Please try again.', 'सम्पर्क हुन सकेन। पुनः प्रयास गर्नुहोस्।')); setBusy(false); }
  };
  return <main className={`ant-admin ant-login ${lang === 'ne' ? 'ant-nepali' : ''}`}><div className="ant-login-top"><Link href="/" className="ant-login-back"><ArrowLeft size={16} />{t('Back to website', 'वेबसाइटमा फर्कनुहोस्')}</Link><div className="ant-language" role="group" aria-label={t('Interface language', 'इन्टरफेस भाषा')}><button type="button" aria-pressed={lang === 'en'} onClick={() => setLang('en')}>EN</button><button type="button" aria-pressed={lang === 'ne'} onClick={() => setLang('ne')}>ने</button></div></div><div className="ant-login-card"><Link href="/" className="ant-login-brand"><BrandLockup /></Link><div className="ant-login-rule" /><span className="ant-eyebrow">{t('ANTWU CONTENT DESK', 'अन्तु सामग्री कार्यक्षेत्र')}</span><h1>{t('Welcome back.', 'पुनः स्वागत छ।')}</h1><p>{t('Sign in to keep our community connected.', 'समुदायसँग जोडिइरहन लगइन गर्नुहोस्।')}</p><form onSubmit={submit} className="ant-login-form"><label className="ant-field" htmlFor="admin-email"><span>{t('Email address', 'इमेल ठेगाना')}</span><input id="admin-email" name="email" type="email" autoComplete="username" required disabled={busy} /></label><label className="ant-field" htmlFor="admin-password"><span>{t('Password', 'पासवर्ड')}</span><div className="ant-password-input"><input id="admin-password" name="password" type={visible ? 'text' : 'password'} autoComplete="current-password" required disabled={busy} /><button type="button" aria-label={visible ? t('Hide password', 'पासवर्ड लुकाउनुहोस्') : t('Show password', 'पासवर्ड देखाउनुहोस्')} onClick={() => setVisible(!visible)}>{visible ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></label>{error && <div className="ant-alert ant-alert-error" role="alert">{error}</div>}<button type="submit" className="ant-button ant-button-primary" disabled={busy}>{busy ? t('Signing in…', 'लगइन हुँदैछ…') : t('Sign in to workspace', 'कार्य क्षेत्रमा लगइन')}<ArrowRight size={17} /></button></form><p className="ant-login-help">{t('Need access? Contact your site administrator.', 'पहुँच चाहिन्छ? साइट प्रशासकसँग सम्पर्क गर्नुहोस्।')}</p></div><footer className="ant-login-footer"><ShieldCheck size={15} /><span>{t('Secure administration · All Nepal Transport Workers Union', 'सुरक्षित प्रशासन · अखिल नेपाल यातायात मजदुर संघ')}</span></footer></main>;
}
