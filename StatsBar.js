import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { COLORS, BLOCK_COLORS } from '../theme';

export default function StatsBar({ stats }) {
  if (!stats || !stats.blocks || stats.blocks.length === 0) return null;
  const { blocks, totalRooms, totalAvailable } = stats;
  const pct = Math.round((totalAvailable / totalRooms) * 100) || 0;

  return (
    <View style={styles.container}>
      {/* Title row */}
      <View style={styles.titleRow}>
        <View style={styles.redBar} />
        <Text style={styles.title}>CAMPUS AVAILABILITY</Text>
        <View style={styles.livePill}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>LIVE</Text>
        </View>
      </View>

      {/* Stats row */}
      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={styles.statNum}>{totalAvailable}</Text>
          <Text style={styles.statLabel}>FREE ROOMS</Text>
        </View>
        <View style={styles.barWrap}>
          <View style={styles.track}>
            <View style={[styles.fill, { width: `${pct}%` }]} />
          </View>
          <Text style={styles.pct}>{pct}% available</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statNum}>{totalRooms}</Text>
          <Text style={styles.statLabel}>TOTAL</Text>
        </View>
      </View>

      {/* Block chips */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
        {blocks.map((b) => {
          const color = BLOCK_COLORS[b._id] || COLORS.red;
          return (
            <View key={b._id} style={[styles.chip, { borderColor: color + '55' }]}>
              <View style={[styles.dot, { backgroundColor: color }]} />
              <Text style={styles.chipName}>{b._id}</Text>
              <Text style={[styles.chipCount, { color }]}>{b.available}/{b.total}</Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.charcoal,
    paddingTop: 16, paddingBottom: 12,
    borderBottomWidth: 1, borderBottomColor: '#333',
  },
  titleRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, marginBottom: 14, gap: 10,
  },
  redBar: { width: 4, height: 18, backgroundColor: COLORS.red, borderRadius: 2 },
  title: { color: COLORS.white, fontSize: 13, fontWeight: '800', flex: 1, letterSpacing: 1 },
  livePill: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: COLORS.red + '22',
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 3,
    borderWidth: 1, borderColor: COLORS.red,
  },
  liveDot: { width: 7, height: 7, borderRadius: 99, backgroundColor: COLORS.red },
  liveText: { color: COLORS.red, fontSize: 10, fontWeight: '900', letterSpacing: 1 },
  statsRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, marginBottom: 14, gap: 12,
  },
  stat: { alignItems: 'center', minWidth: 56 },
  statNum: { color: COLORS.gold, fontSize: 26, fontWeight: '900' },
  statLabel: { color: COLORS.textMuted, fontSize: 9, fontWeight: '700', marginTop: 1, letterSpacing: 0.8 },
  barWrap: { flex: 1, gap: 5 },
  track: { height: 5, backgroundColor: '#333', borderRadius: 99, overflow: 'hidden' },
  fill: { height: 5, backgroundColor: COLORS.red, borderRadius: 99 },
  pct: { color: COLORS.textMuted, fontSize: 11, textAlign: 'center' },
  chips: { paddingHorizontal: 12, flexDirection: 'row' },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 11, paddingVertical: 6,
    borderRadius: 3, borderWidth: 1,
    backgroundColor: '#2a2a2a', marginRight: 8,
  },
  dot: { width: 6, height: 6, borderRadius: 99 },
  chipName: { color: COLORS.textSub, fontSize: 11, fontWeight: '600' },
  chipCount: { fontSize: 11, fontWeight: '800' },
});
