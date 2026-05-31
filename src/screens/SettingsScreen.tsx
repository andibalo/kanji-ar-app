import React from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppSettings } from '../context/AppSettingsContext';

type RowProps = {
  label: string;
  description?: string;
  value?: boolean;
  onValueChange?: (v: boolean) => void;
};

function SettingRow({ label, description, value = false, onValueChange }: RowProps) {
  return (
    <View style={styles.row}>
      <View style={styles.rowText}>
        <Text style={styles.label}>{label}</Text>
        {!!description && <Text style={styles.description}>{description}</Text>}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        disabled={!onValueChange}
        trackColor={{ false: '#3A3A5A', true: '#FFD700' }}
        thumbColor={value ? '#1A1A2E' : '#888'}
      />
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
  const { highPerformanceMode, setHighPerformanceMode } = useAppSettings();

  return (
    <View style={[styles.container, { paddingBottom: bottom }]}>
      <Section title="Scanner">
        <SettingRow
          label="High Performance Mode"
          description="Increases scanner frame rate to detect kanji faster but may slow down overall app performance"
          value={highPerformanceMode}
          onValueChange={setHighPerformanceMode}
        />
      </Section>
      <View style={styles.footer}>
        <Text style={styles.footerText}>KanjiCamera · Version 0.0.1</Text>
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
    color: '#666',
    marginBottom: 8,
  },
});
