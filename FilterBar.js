import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { COLORS, CANTEENS, CANTEEN_EMOJIS } from '../theme';

export default function FilterBar({ selectedCanteen, onSelectCanteen, blocks, selectedBlock, onSelectBlock }) {
  return (
    <View style={styles.container}>
      {/* Section header — matches Advantage's red-bar + label style */}
      <View style={styles.sectionHead}>
        <View style={styles.redBar} />
        <Text style={styles.sectionLabel}>FILTER CLASSROOMS</Text>
      </View>

      <Text style={styles.label}>NEAREST CANTEEN</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {CANTEENS.map((c) => {
          const active = selectedCanteen === c;
          return (
            <TouchableOpacity key={c}
              style={[styles.pill, active && styles.pillRed]}
              onPress={() => onSelectCanteen(c)} activeOpacity={0.8}
            >
              <Text style={styles.emoji}>{CANTEEN_EMOJIS[c]}</Text>
              <Text style={[styles.pillText, active && styles.pillTextActive]}>{c}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <Text style={[styles.label, { marginTop: 12 }]}>BLOCK</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {['All', ...blocks].map((b) => {
          const active = selectedBlock === b;
          return (
            <TouchableOpacity key={b}
              style={[styles.pill, active && styles.pillRed]}
              onPress={() => onSelectBlock(b)} activeOpacity={0.8}
            >
              <Text style={[styles.pillText, active && styles.pillTextActive]}>{b}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.charcoal,
    paddingVertical: 16,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.red,
  },
  sectionHead: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, marginBottom: 14 },
  redBar: { width: 4, height: 18, backgroundColor: COLORS.red, borderRadius: 2, marginRight: 10 },
  sectionLabel: { color: COLORS.white, fontSize: 13, fontWeight: '800', letterSpacing: 1 },
  label: {
    color: COLORS.textMuted, fontSize: 10, fontWeight: '700',
    letterSpacing: 1.5, paddingHorizontal: 16, marginBottom: 8, textTransform: 'uppercase',
  },
  scroll: { paddingHorizontal: 12, flexDirection: 'row' },
  pill: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: 3, backgroundColor: '#2a2a2a',
    borderWidth: 1, borderColor: '#444', marginRight: 8,
  },
  pillRed: { backgroundColor: COLORS.red, borderColor: COLORS.red },
  emoji: { fontSize: 13 },
  pillText: { color: COLORS.textSub, fontSize: 12, fontWeight: '600' },
  pillTextActive: { color: COLORS.white, fontWeight: '800' },
});
