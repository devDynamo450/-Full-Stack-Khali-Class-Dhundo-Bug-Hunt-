/**
 * Footer.js — Semantic footer for Khali Class Dhundo
 * Sections: About | Quick Links | Campus Info | Contact | Social | Legal
 * Styled to match the Advantage Fitness dark + red design language.
 */
import React, { useRef, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  Platform, Animated, Linking,
} from 'react-native';
import { COLORS } from '../theme';

const isWeb = Platform.OS === 'web';

const QUICK_LINKS = [
  { label: 'Find Empty Rooms',   href: '#rooms'   },
  { label: 'A-Block Classrooms', href: '#a-block'  },
  { label: 'Lab Block',          href: '#lab'      },
  { label: 'Seminar Halls',      href: '#seminar'  },
  { label: 'Campus Map',         href: '#map'      },
  { label: 'Timetable',          href: '#tt'       },
];

const CAMPUS_LINKS = [
  { label: 'Galgotias University Portal', href: 'https://galgotiasuniversity.edu.in' },
  { label: 'Student Dashboard',           href: '#dashboard' },
  { label: 'Exam Schedule',               href: '#exams'     },
  { label: 'Faculty Directory',           href: '#faculty'   },
];

const SOCIAL = [
  { icon: '𝕏',  label: 'Twitter / X',  href: 'https://twitter.com' },
  { icon: 'in', label: 'LinkedIn',       href: 'https://linkedin.com' },
  { icon: '▶',  label: 'YouTube',        href: 'https://youtube.com' },
  { icon: '●',  label: 'Instagram',      href: 'https://instagram.com' },
];

// ─── Animated footer link ────────────────────────────────────────────────────
function FooterLink({ label, href }) {
  const underline = useRef(new Animated.Value(0)).current;

  const onHoverIn  = () => Animated.timing(underline, { toValue: 1, duration: 180, useNativeDriver: false }).start();
  const onHoverOut = () => Animated.timing(underline, { toValue: 0, duration: 180, useNativeDriver: false }).start();

  const webHover = isWeb ? { onMouseEnter: onHoverIn, onMouseLeave: onHoverOut } : {};

  const underlineWidth = underline.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });
  const textColor      = underline.interpolate({ inputRange: [0, 1], outputRange: ['#999999', COLORS.red] });

  const press = () => { if (href?.startsWith('http')) Linking.openURL(href); };

  return (
    <TouchableOpacity onPress={press} activeOpacity={0.75} style={styles.footerLinkBtn} {...webHover}>
      <Animated.Text style={[styles.footerLinkText, { color: textColor }]}>
        {'› '}{label}
      </Animated.Text>
      <View style={styles.footerLinkUnderlineTrack}>
        <Animated.View style={[styles.footerLinkUnderline, { width: underlineWidth }]} />
      </View>
    </TouchableOpacity>
  );
}

// ─── Social icon button ──────────────────────────────────────────────────────
function SocialBtn({ icon, label, href }) {
  const scale = useRef(new Animated.Value(1)).current;
  const bg    = useRef(new Animated.Value(0)).current;

  const pressIn  = () => Animated.spring(scale, { toValue: 0.9, useNativeDriver: true, speed: 50 }).start();
  const pressOut = () => Animated.spring(scale, { toValue: 1,   useNativeDriver: true, speed: 40 }).start();

  const webHover = isWeb ? {
    onMouseEnter: () => Animated.timing(bg, { toValue: 1, duration: 180, useNativeDriver: false }).start(),
    onMouseLeave: () => Animated.timing(bg, { toValue: 0, duration: 180, useNativeDriver: false }).start(),
  } : {};

  const bgColor = bg.interpolate({ inputRange: [0, 1], outputRange: ['#2a2a2a', COLORS.red] });

  return (
    <TouchableOpacity
      onPress={() => Linking.openURL(href)}
      onPressIn={pressIn}
      onPressOut={pressOut}
      activeOpacity={0.8}
      accessibilityLabel={label}
      accessibilityRole="link"
      {...webHover}
    >
      <Animated.View style={[styles.socialBtn, { backgroundColor: bgColor }]}>
        <Animated.Text style={[styles.socialIcon, { transform: [{ scale }] }]}>
          {icon}
        </Animated.Text>
      </Animated.View>
    </TouchableOpacity>
  );
}

// ─── Section heading ─────────────────────────────────────────────────────────
function FooterSectionHead({ title }) {
  return (
    <View style={styles.sectionHeadRow}>
      <View style={styles.sectionHeadBar} />
      <Text style={styles.sectionHeadText}>{title}</Text>
    </View>
  );
}

// ─── Main Footer ─────────────────────────────────────────────────────────────
export default function Footer() {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 700, delay: 300, useNativeDriver: true }).start();
  }, []);

  const year = new Date().getFullYear();

  return (
    <Animated.View style={[styles.footerRoot, { opacity: fadeAnim }]}>

      {/* ── Top red divider ────────────────────────────────────────────────── */}
      <View style={styles.topDivider} />

      {/* ── Brand strip ────────────────────────────────────────────────────── */}
      <View style={styles.brandStrip}>
        <View style={styles.brandLeft}>
          <View style={styles.brandLogo}>
            <Text style={styles.brandLogoEmoji}>🏛️</Text>
          </View>
          <View>
            <Text style={styles.brandTitle}>KHALI CLASS DHUNDO</Text>
            <Text style={styles.brandTagline}>
              Galgotias University · Real-Time Classroom Finder
            </Text>
          </View>
        </View>
        <View style={styles.brandRight}>
          {SOCIAL.map((s) => (
            <SocialBtn key={s.label} icon={s.icon} label={s.label} href={s.href} />
          ))}
        </View>
      </View>

      {/* ── Three-column link grid ──────────────────────────────────────────── */}
      <View style={styles.linkGrid}>

        {/* Column 1 — About */}
        <View style={styles.col}>
          <FooterSectionHead title="ABOUT" />
          <Text style={styles.aboutText}>
            Khali Class Dhundo is a live classroom availability tracker for Galgotias University
            students. Find free rooms across all 8 campus blocks in real-time, filter by nearest
            canteen, and claim a room instantly.
          </Text>
          <View style={styles.statusRow}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>All systems operational</Text>
          </View>
        </View>

        {/* Column 2 — Quick Links */}
        <View style={styles.col}>
          <FooterSectionHead title="QUICK LINKS" />
          {QUICK_LINKS.map((l) => (
            <FooterLink key={l.label} label={l.label} href={l.href} />
          ))}
        </View>

        {/* Column 3 — Campus */}
        <View style={styles.col}>
          <FooterSectionHead title="CAMPUS" />
          {CAMPUS_LINKS.map((l) => (
            <FooterLink key={l.label} label={l.label} href={l.href} />
          ))}

          <FooterSectionHead title="CONTACT" />
          <View style={styles.contactRow}>
            <Text style={styles.contactIcon}>📞</Text>
            <Text style={styles.contactText}>+91 120-232-3000</Text>
          </View>
          <View style={styles.contactRow}>
            <Text style={styles.contactIcon}>✉️</Text>
            <Text style={styles.contactText}>support@galgotiasuniv.edu.in</Text>
          </View>
          <View style={styles.contactRow}>
            <Text style={styles.contactIcon}>📍</Text>
            <Text style={styles.contactText}>Plot No. 2, Yamuna Expy,{'\n'}Greater Noida, UP — 203201</Text>
          </View>
        </View>
      </View>

      {/* ── Stats row ──────────────────────────────────────────────────────── */}
      <View style={styles.statsStrip}>
        {[
          { num: '8',    label: 'Campus Blocks' },
          { num: '200+', label: 'Classrooms'    },
          { num: '24/7', label: 'Live Updates'  },
          { num: '50K+', label: 'Students'      },
        ].map((s) => (
          <View key={s.label} style={styles.statItem}>
            <Text style={styles.statNum}>{s.num}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      {/* ── Legal / copyright bar ──────────────────────────────────────────── */}
      <View style={styles.legalBar}>
        <Text style={styles.copyright}>
          © {year} Khali Class Dhundo · Galgotias University. All rights reserved.
        </Text>
        <View style={styles.legalLinks}>
          {['Privacy Policy', 'Terms of Use', 'Accessibility'].map((t, i) => (
            <React.Fragment key={t}>
              {i > 0 && <Text style={styles.legalDivider}>·</Text>}
              <TouchableOpacity activeOpacity={0.7}>
                <Text style={styles.legalLink}>{t}</Text>
              </TouchableOpacity>
            </React.Fragment>
          ))}
        </View>
      </View>

    </Animated.View>
  );
}

const styles = StyleSheet.create({
  footerRoot: {
    backgroundColor: '#0d0d0d',
    marginTop: 20,
  },

  // ── Top red divider ─────────────────────────────────────────────────────────
  topDivider: {
    height: 4,
    backgroundColor: COLORS.red,
  },

  // ── Brand strip ─────────────────────────────────────────────────────────────
  brandStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    paddingHorizontal: 24,
    paddingVertical: 22,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
    gap: 14,
  },
  brandLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
    flexWrap: 'wrap',
  },
  brandLogo: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.red,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.red,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 6,
  },
  brandLogoEmoji: { fontSize: 20 },
  brandTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  brandTagline: {
    color: '#888',
    fontSize: 11,
    marginTop: 2,
    letterSpacing: 0.3,
  },
  brandRight: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },

  // Social
  socialBtn: {
    width: 36,
    height: 36,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#444',
  },
  socialIcon: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },

  // ── 3-column link grid ──────────────────────────────────────────────────────
  linkGrid: {
    flexDirection: isWeb ? 'row' : 'column',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    paddingVertical: 28,
    gap: 28,
    borderBottomWidth: 1,
    borderBottomColor: '#1e1e1e',
  },
  col: {
    flex: 1,
    minWidth: isWeb ? 200 : '100%',
  },

  // Section heading
  sectionHeadRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
    marginTop: 6,
  },
  sectionHeadBar: {
    width: 3,
    height: 16,
    backgroundColor: COLORS.red,
    borderRadius: 2,
  },
  sectionHeadText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },

  // About column
  aboutText: {
    color: '#888',
    fontSize: 12,
    lineHeight: 20,
    marginBottom: 14,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22c55e',
  },
  statusText: {
    color: '#22c55e',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.3,
  },

  // Footer link
  footerLinkBtn: {
    marginBottom: 10,
  },
  footerLinkText: {
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  footerLinkUnderlineTrack: {
    height: 1,
    backgroundColor: 'transparent',
    marginTop: 1,
    overflow: 'hidden',
  },
  footerLinkUnderline: {
    height: 1,
    backgroundColor: COLORS.red,
  },

  // Contact
  contactRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
    alignItems: 'flex-start',
  },
  contactIcon: { fontSize: 13, marginTop: 1 },
  contactText: {
    color: '#888',
    fontSize: 12,
    lineHeight: 18,
    flex: 1,
  },

  // ── Stats strip ─────────────────────────────────────────────────────────────
  statsStrip: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    flexWrap: 'wrap',
    paddingVertical: 22,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1e1e1e',
    backgroundColor: '#111',
    gap: 12,
  },
  statItem: { alignItems: 'center', minWidth: 70 },
  statNum: {
    color: COLORS.red,
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  statLabel: {
    color: '#777',
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.8,
    marginTop: 3,
    textTransform: 'uppercase',
  },

  // ── Legal bar ───────────────────────────────────────────────────────────────
  legalBar: {
    flexDirection: isWeb ? 'row' : 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: 10,
    flexWrap: 'wrap',
  },
  copyright: {
    color: '#555',
    fontSize: 11,
    letterSpacing: 0.2,
    textAlign: 'center',
  },
  legalLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  legalLink: {
    color: '#666',
    fontSize: 11,
    letterSpacing: 0.2,
  },
  legalDivider: {
    color: '#444',
    fontSize: 11,
  },
});
