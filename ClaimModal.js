import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { COLORS } from '../theme';

export default function ClaimModal({ visible, roomName, onConfirm, onCancel }) {
  const [name, setName] = useState('');
  if (!visible) return null;

  const confirm = () => {
    if (!name.trim()) return;
    onConfirm(name.trim());
    setName('');
  };

  return (
    <View style={styles.overlay}>
      <TouchableOpacity style={styles.backdrop} onPress={() => { setName(''); onCancel(); }} activeOpacity={1} />
      <View style={styles.sheet}>
        {/* Red top accent bar — like Advantage's CTA elements */}
        <View style={styles.topAccentBar} />

        <View style={styles.topBar}>
          <View style={styles.handle} />
        </View>

        <View style={styles.titleRow}>
          <View style={styles.redAccent} />
          <Text style={styles.title}>CLAIM {roomName}</Text>
        </View>
        <Text style={styles.subtitle}>Enter your name or roll number to reserve this classroom:</Text>

        <TextInput
          style={styles.input}
          placeholder="e.g. 22BCS042 / Arjun Kumar"
          placeholderTextColor={COLORS.textMuted}
          value={name}
          onChangeText={setName}
          autoFocus
          maxLength={40}
          onSubmitEditing={confirm}
          returnKeyType="done"
          accessibilityLabel="Name or roll number"
        />

        <View style={styles.actions}>
          <TouchableOpacity style={styles.cancelBtn} onPress={() => { setName(''); onCancel(); }}>
            <Text style={styles.cancelText}>CANCEL</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.confirmBtn, !name.trim() && styles.confirmOff]}
            onPress={confirm} disabled={!name.trim()}
          >
            <Text style={styles.confirmText}>CONFIRM CLAIM</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'flex-end', zIndex: 100 },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: '#000000BB' },
  sheet: {
    backgroundColor: COLORS.charcoal,
    borderTopLeftRadius: 6, borderTopRightRadius: 6,
    paddingBottom: Platform.OS === 'ios' ? 40 : 28,
    overflow: 'hidden',
  },
  topAccentBar: {
    height: 4, backgroundColor: COLORS.red,
    width: '100%',
  },
  topBar: { alignItems: 'center', paddingTop: 10, paddingBottom: 4 },
  handle: { width: 40, height: 4, borderRadius: 99, backgroundColor: '#444' },
  titleRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 20, paddingTop: 14, paddingBottom: 6,
  },
  redAccent: { width: 4, height: 24, backgroundColor: COLORS.red, borderRadius: 2, marginRight: 12 },
  title: { color: COLORS.white, fontSize: 20, fontWeight: '900', letterSpacing: 1 },
  subtitle: { color: COLORS.textSub, fontSize: 13, paddingHorizontal: 20, marginBottom: 16, lineHeight: 20 },
  input: {
    backgroundColor: '#222',
    borderWidth: 1, borderColor: '#444',
    borderRadius: 4, padding: 14, marginHorizontal: 20,
    color: COLORS.white, fontSize: 15, marginBottom: 18,
  },
  actions: { flexDirection: 'row', gap: 10, paddingHorizontal: 20 },
  cancelBtn: {
    flex: 1, backgroundColor: '#2a2a2a',
    padding: 14, borderRadius: 4, alignItems: 'center',
    borderWidth: 1, borderColor: '#444',
  },
  cancelText: { color: COLORS.textSub, fontWeight: '800', fontSize: 12, letterSpacing: 1 },
  confirmBtn: {
    flex: 2, backgroundColor: COLORS.red,
    padding: 14, borderRadius: 4, alignItems: 'center',
  },
  confirmOff: { opacity: 0.4 },
  confirmText: { color: COLORS.white, fontWeight: '800', fontSize: 12, letterSpacing: 1 },
});
