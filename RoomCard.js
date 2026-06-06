/**
 * RoomCard.js — Animated room card
 * CSS Animations:
 *  1. Staggered entrance  — fadeIn + slideUp on mount (delay = index * 80ms)
 *  2. Stripe grow         — width animates from 0 → 100% on mount
 *  3. Hover lift          — card translates up + red border glow on web hover
 *  4. Button pulse-glow   — red glow breathes in/out continuously
 *  5. Press scale         — spring scale down on press
 *  6. Room number shimmer — opacity pulse on the big room number
 */
import React, { useRef, useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ActivityIndicator, Animated, Platform,
} from 'react-native';
import { COLORS, BLOCK_COLORS, TYPE_ICONS } from '../theme';

const isWeb = Platform.OS === 'web';

export default function RoomCard({ room, claimingId, onClaim, index = 0 }) {
  const isClaiming  = claimingId === room._id;
  const blockColor  = BLOCK_COLORS[room.block] || COLORS.red;

  // ── 1. Entrance animation (fadeIn + slideUp, staggered by index) ────────────
  const entranceFade  = useRef(new Animated.Value(0)).current;
  const entranceSlide = useRef(new Animated.Value(28)).current;

  // ── 2. Stripe grow (width 0 → 1 = 0% → 100%) ────────────────────────────────
  const stripeGrow = useRef(new Animated.Value(0)).current;

  // ── 3. Hover lift (web) ──────────────────────────────────────────────────────
  const hoverY      = useRef(new Animated.Value(0)).current;
  const hoverShadow = useRef(new Animated.Value(0)).current;
  const [hovered, setHovered] = useState(false);

  // ── 4. Button pulse-glow ────────────────────────────────────────────────────
  const btnGlow  = useRef(new Animated.Value(0.55)).current;
  const btnScale = useRef(new Animated.Value(1)).current;

  // ── 5. Press scale ──────────────────────────────────────────────────────────
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // ── 6. Room number shimmer ──────────────────────────────────────────────────
  const shimmer = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const delay = index * 80;

    // Entrance
    Animated.parallel([
      Animated.timing(entranceFade,  { toValue: 1, duration: 500, delay, useNativeDriver: true }),
      Animated.timing(entranceSlide, { toValue: 0, duration: 420, delay, useNativeDriver: true }),
    ]).start();

    // Stripe grow
    Animated.timing(stripeGrow, {
      toValue: 1, duration: 600, delay: delay + 120, useNativeDriver: false,
    }).start();

    // Button pulse-glow (loop)
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(btnGlow, { toValue: 1,    duration: 1000, useNativeDriver: false }),
        Animated.timing(btnGlow, { toValue: 0.55, duration: 1000, useNativeDriver: false }),
      ])
    );
    const pulseTimer = setTimeout(() => pulseLoop.start(), delay + 600);

    // Room number shimmer (loop)
    const shimmerLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, { toValue: 0.6, duration: 1800, useNativeDriver: true }),
        Animated.timing(shimmer, { toValue: 1,   duration: 1800, useNativeDriver: true }),
      ])
    );
    const shimmerTimer = setTimeout(() => shimmerLoop.start(), delay + 300);

    return () => {
      clearTimeout(pulseTimer);
      clearTimeout(shimmerTimer);
      pulseLoop.stop();
      shimmerLoop.stop();
    };
  }, []);

  // ── Hover handlers (web only) ───────────────────────────────────────────────
  const handleMouseEnter = () => {
    setHovered(true);
    Animated.parallel([
      Animated.spring(hoverY, { toValue: -7, useNativeDriver: true, speed: 30, bounciness: 6 }),
      Animated.timing(hoverShadow, { toValue: 1, duration: 220, useNativeDriver: false }),
    ]).start();
  };
  const handleMouseLeave = () => {
    setHovered(false);
    Animated.parallel([
      Animated.spring(hoverY, { toValue: 0, useNativeDriver: true, speed: 30, bounciness: 4 }),
      Animated.timing(hoverShadow, { toValue: 0, duration: 220, useNativeDriver: false }),
    ]).start();
  };

  // ── Press handlers ──────────────────────────────────────────────────────────
  const pressIn  = () => Animated.spring(scaleAnim, { toValue: 0.96, useNativeDriver: true, speed: 50 }).start();
  const pressOut = () => Animated.spring(scaleAnim, { toValue: 1,    useNativeDriver: true, speed: 40 }).start();

  // ── Interpolated values ─────────────────────────────────────────────────────
  const stripeWidth     = stripeGrow.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });
  const btnShadowRadius = btnGlow.interpolate({ inputRange: [0.55, 1], outputRange: [4, 16] });
  const btnShadowOpacity= btnGlow.interpolate({ inputRange: [0.55, 1], outputRange: [0.3, 0.7] });
  const borderGlowColor = hoverShadow.interpolate({
    inputRange: [0, 1],
    outputRange: ['#333333', blockColor],
  });

  const webHoverProps = isWeb ? {
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
  } : {};

  return (
    <Animated.View
      style={[
        styles.wrapper,
        {
          opacity:   entranceFade,
          transform: [
            { translateY: Animated.add(entranceSlide, hoverY) },
            { scale: scaleAnim },
          ],
        },
      ]}
      {...webHoverProps}
    >
      {/* Card with animated border color on hover */}
      <Animated.View
        style={[
          styles.card,
          { borderColor: borderGlowColor },
          hovered && isWeb && {
            shadowColor: blockColor,
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.45,
            shadowRadius: 20,
          },
        ]}
      >
        {/* ── Animated colored top stripe (grows left → right) ─────────────── */}
        <View style={styles.stripeTrack}>
          <Animated.View
            style={[styles.stripe, { backgroundColor: blockColor, width: stripeWidth }]}
          />
        </View>

        <View style={styles.body}>
          {/* Header row */}
          <View style={styles.headerRow}>
            <View style={[styles.blockBadge, { backgroundColor: blockColor + '20', borderColor: blockColor + '55' }]}>
              <Text style={[styles.blockText, { color: blockColor }]}>{room.block}</Text>
            </View>
            <View style={styles.floorBadge}>
              <Text style={styles.floorText}>Floor {room.floor}</Text>
            </View>
          </View>

          {/* Room number with shimmer opacity animation */}
          <Animated.Text style={[styles.roomNum, { opacity: shimmer }]}>
            {room.roomNumber}
          </Animated.Text>

          {/* Type + capacity */}
          <View style={styles.metaRow}>
            <Text style={styles.typeIcon}>{TYPE_ICONS[room.type] || '🏫'}</Text>
            <Text style={styles.typeText}>{room.type}</Text>
            <Text style={styles.sep}>•</Text>
            <Text style={styles.cap}>👥 {room.capacity}</Text>
          </View>

          {/* Canteen */}
          <View style={styles.canteenRow}>
            <Text style={styles.pin}>📍</Text>
            <Text style={styles.canteenText}>{room.nearestCanteen}</Text>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Claim button with animated glow shadow */}
          <Animated.View
            style={[
              styles.btnGlowWrap,
              {
                shadowColor:   COLORS.red,
                shadowRadius:  btnShadowRadius,
                shadowOpacity: btnShadowOpacity,
                shadowOffset:  { width: 0, height: 2 },
                elevation: 6,
              },
            ]}
          >
            <TouchableOpacity
              style={[styles.btn, isClaiming && styles.btnLoading]}
              onPress={() => onClaim(room._id, room.roomNumber)}
              onPressIn={pressIn}
              onPressOut={pressOut}
              disabled={!!claimingId}
              activeOpacity={0.82}
              accessibilityLabel={`Claim room ${room.roomNumber}`}
              accessibilityRole="button"
            >
              {isClaiming
                ? <ActivityIndicator size="small" color="#fff" />
                : <Text style={styles.btnText}>CLAIM ROOM →</Text>
              }
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    margin: 7,
    // Web: smooth CSS transition for hover lift
    ...(isWeb ? { transition: 'all 0.25s ease' } : {}),
  },
  card: {
    backgroundColor: COLORS.charcoal,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#333',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 5,
  },

  // Stripe
  stripeTrack: {
    height: 4,
    backgroundColor: '#1a1a1a',
    overflow: 'hidden',
  },
  stripe: {
    height: 4,
  },

  body: { padding: 16 },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  blockBadge: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 3,
    borderWidth: 1,
  },
  blockText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  floorBadge: {
    backgroundColor: '#2a2a2a',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#444',
  },
  floorText: {
    color: COLORS.textSub,
    fontSize: 11,
    fontWeight: '600',
  },

  roomNum: {
    color: COLORS.white,
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: -0.5,
    marginBottom: 8,
  },

  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 5,
  },
  typeIcon: { fontSize: 13 },
  typeText: { color: COLORS.textSub, fontSize: 12, fontWeight: '600', flex: 1 },
  sep:      { color: COLORS.textMuted, fontSize: 10 },
  cap:      { color: COLORS.textMuted, fontSize: 12 },

  canteenRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 14,
  },
  pin:        { fontSize: 11 },
  canteenText:{ color: COLORS.textMuted, fontSize: 12 },

  divider: {
    height: 1,
    backgroundColor: '#2e2e2e',
    marginBottom: 14,
  },

  // Button glow wrapper
  btnGlowWrap: {
    borderRadius: 3,
    overflow: 'visible',
  },
  btn: {
    backgroundColor: COLORS.red,
    paddingVertical: 12,
    borderRadius: 3,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 42,
  },
  btnLoading: {
    backgroundColor: '#2e2e2e',
    opacity: 0.7,
  },
  btnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
});
