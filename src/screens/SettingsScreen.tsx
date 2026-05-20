import React from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type RowProps = { label: string; description?: string };

function SettingRow({ label, description }: RowProps) {
  return (
    <View style={styles.row}>
      <View style={styles.rowText}>
        <Text style={styles.label}>{label}</Text>
        {!!description && <Text style={styles.description}>{description}</Text>}
      </View>
      <Switch value={false} disabled trackColor={{ true: '#FFD700' }} />
    </View>
  );
}

type SectionProps = { title: string; children: React.ReactNode };

function Section({ title, children }: SectionProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionBody}>{children}</View>
    </View>
  );
}

export function SettingsScreen() {
  const { bottom } = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: bottom }]}>
      <Section title="Scanning">
        <SettingRow label="Auto-scan on launch" description="Start scanning when app opens" />
        <SettingRow label="Haptic feedback" description="Vibrate when kanji is detected" />
      </Section>

      <Section title="OCR">
        <SettingRow label="High accuracy mode" description="Slower but more accurate recognition" />
        <SettingRow label="Scan hiragana" description="Include hiragana in results" />
      </Section>

      <Section title="Dictionary">
        <SettingRow label="Show furigana" description="Display readings above kanji" />
        <SettingRow label="JLPT filter" description="Only show words from your JLPT level" />
      </Section>

      <Section title="Appearance">
        <SettingRow label="Dark overlay" description="Dim areas outside the scan region" />
      </Section>

      <View style={styles.footer}>
        <Text style={styles.footerText}>KanjiAR · Version 0.0.1</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A2E',
  },
  section: {
    marginTop: 24,
    marginHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFD700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  sectionBody: {
    backgroundColor: '#22223A',
    borderRadius: 12,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#2E2E4A',
  },
  rowText: {
    flex: 1,
    marginRight: 12,
  },
  label: {
    fontSize: 15,
    color: '#CCC',
    fontWeight: '500',
  },
  description: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  footer: {
    marginTop: 'auto',
    paddingTop: 32,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#444',
  },
});
