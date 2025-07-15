import React, { useState, useEffect } from 'react';

// تابع تولید کپچا
function generateCaptchaText(length = 5) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}

// فرمت تایمر ثانیه به mm:ss
function formatTime(secs) {
    const m = String(Math.floor(secs / 60)).padStart(2, '0');
    const s = String(secs % 60).padStart(2, '0');
    return `${m}:${s}`;
}

export default function OrderPaymentPage() {
    const [captcha, setCaptcha] = useState(generateCaptchaText());
    const [expMonth, setExpMonth] = useState('');
    const [expYear, setExpYear] = useState('');
    const [timeLeft, setTimeLeft] = useState(10 * 60); // ۱۰ دقیقه ثانیه

    // تایمر معکوس
    useEffect(() => {
        if (timeLeft === 0) return; // تموم شده، قطع شه
        const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
        return () => clearInterval(timer);
    }, [timeLeft]);

    const refreshCaptcha = () => setCaptcha(generateCaptchaText());

    // وقتی تایمر تموم بشه، فرم غیرفعال میشه
    const isExpired = timeLeft === 0;

    return (
        <div style={{
            width: '100vw',
            height: '100vh',
            background: '#f3f4f6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <form
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.15rem',
                    padding: '2.5rem 2.5rem 2.8rem 2.5rem',
                    background: '#fff',
                    borderRadius: '16px',
                    boxShadow: '0 6px 36px 6px rgba(0,0,0,0.09)',
                    minWidth: '340px',
                    maxWidth: '94vw',
                }}
                onSubmit={e => {
                    e.preventDefault();
                    if (isExpired) {
                        alert("مهلت پرداخت تمام شده است!");
                        return;
                    }
                    alert('پرداخت با موفقیت ارسال شد!');
                }}
            >
                <h2 style={{ textAlign: 'center', marginBottom: '0.8rem', fontWeight: '800' }}>
                    پرداخت سفارش
                </h2>

                {/* ثانیه‌شمار معکوس */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: '-0.5rem'
                }}>
          <span style={{
              padding: '0.4rem 1.1rem',
              borderRadius: '6px',
              background: '#fff9e0',
              color: '#e68001',
              fontWeight: 'bold',
              fontVariantNumeric: 'tabular-nums',
              fontSize: '1.1rem'
          }}>
            فرصت باقی‌مانده: {formatTime(timeLeft)}
          </span>
                </div>

                <input
                    type="text"
                    placeholder="شماره کارت"
                    required
                    disabled={isExpired}
                    style={{ direction: 'ltr', textAlign: 'center', padding: '0.7rem', fontSize: '1.1rem' }}
                />

                <input
                    type="text"
                    placeholder="CVV2"
                    required
                    disabled={isExpired}
                    style={{ direction: 'ltr', textAlign: 'center', padding: '0.7rem', fontSize: '1.1rem' }}
                />

                {/* تاریخ انقضا */}
                <div style={{
                    display: 'flex',
                    gap: '0.7rem',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <input
                        type="text"
                        placeholder="ماه"
                        maxLength={2}
                        required
                        disabled={isExpired}
                        value={expMonth}
                        onChange={e => {
                            let m = e.target.value.replace(/\D/g, '');
                            if (m.length === 2 && (+m > 12 || +m === 0)) m = '12';
                            setExpMonth(m);
                        }}
                        style={{ width: '60px', direction: 'ltr', textAlign: 'center', padding: '0.65rem', fontSize: '1rem' }}
                    />
                    <span>/</span>
                    <input
                        type="text"
                        placeholder="سال"
                        maxLength={2}
                        required
                        disabled={isExpired}
                        value={expYear}
                        onChange={e => setExpYear(e.target.value.replace(/\D/g, '').slice(0, 2))}
                        style={{ width: '60px', direction: 'ltr', textAlign: 'center', padding: '0.65rem', fontSize: '1rem' }}
                    />
                </div>

                {/* کپچا تصویری با دکمه رفرش */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.55rem'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.4rem'
                    }}>
                        {/* تصویر کپچا */}
                        <svg width="130" height="44"
                             style={{
                                 borderRadius: '6px',
                                 background: '#f1f3fa',
                                 boxShadow: '0 2px 8px #eef4ff'
                             }}>
                            <rect width="130" height="44" rx="6" fill="#e7eaf6" />
                            <text
                                x="50%"
                                y="56%"
                                dominantBaseline="middle"
                                textAnchor="middle"
                                fontSize="25"
                                fill="#333"
                                fontFamily="monospace"
                                style={{ letterSpacing: 4, userSelect: 'none', fontWeight: 'bold' }}
                            >
                                {captcha}
                            </text>
                        </svg>
                        {/* دکمه رفرش کپچا */}
                        <button
                            type="button"
                            title="کپچای جدید"
                            onClick={refreshCaptcha}
                            disabled={isExpired}
                            style={{
                                border: 'none',
                                background: 'none',
                                cursor: 'pointer',
                                fontSize: '1.5rem',
                                color: '#368aec',
                                padding: '6px 6px 0 6px',
                                borderRadius: '50%',
                                userSelect: 'none'
                            }}
                            onMouseOver={e => e.target.style.background = "#e7eaf6"}
                            onMouseOut={e => e.target.style.background = 'none'}
                        >⟳</button>
                    </div>
                    <input
                        type="text"
                        placeholder="کد کپچا را وارد کنید"
                        maxLength={5}
                        required
                        disabled={isExpired}
                        style={{ direction: 'ltr', textAlign: 'center', width: '130px', padding: '0.7rem', fontSize: '1.13rem', background: '#f7fafd' }}
                    />
                </div>

                {/* اگر زمان تمام شد پیام بده */}
                {isExpired && (
                    <div style={{
                        color: "#d32f2f",
                        background: "#fff0ef",
                        textAlign: "center",
                        padding: "0.7rem 0 0.4rem 0",
                        borderRadius: "8px",
                        fontWeight: 700
                    }}>
                        مهلت پرداخت به پایان رسید!
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isExpired}
                    style={{
                        marginTop: '1.6rem',
                        padding: '0.95rem',
                        background: isExpired ? '#a8b6be' : '#268dec',
                        color: '#fff',
                        fontWeight: 'bold',
                        border: 'none',
                        borderRadius: '7px',
                        fontSize: '1.18rem',
                        cursor: isExpired ? 'not-allowed' : 'pointer',
                        transition: 'background .2s'
                    }}
                    onMouseOver={e => !isExpired && (e.target.style.background = "#1670be")}
                    onMouseOut={e => !isExpired && (e.target.style.background = "#268dec")}
                >
                    پرداخت
                </button>
            </form>
        </div>
    );
}
