import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { Ocorrencia } from '../types/ocorrencia';
import { formatarData } from '../utils/date';
import { StatusBadge } from './StatusBadge';

interface OcorrenciaCardProps {
  ocorrencia: Ocorrencia;
  onPress: () => void;
}

export const OcorrenciaCard: React.FC<OcorrenciaCardProps> = ({
  ocorrencia,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.headerRow}>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{ocorrencia.categoria}</Text>
        </View>
        <StatusBadge status={ocorrencia.status} />
      </View>

      <Text style={styles.titulo} numberOfLines={2}>
        {ocorrencia.titulo}
      </Text>

      <View style={styles.metaRow}>
        <Ionicons name="location-outline" size={15} color={colors.textSecondary} />
        <Text style={styles.local} numberOfLines={1}>
          {ocorrencia.local}
        </Text>
      </View>

      <View style={styles.footerRow}>
        <View style={styles.dateContainer}>
          <Ionicons name="time-outline" size={14} color={colors.textMuted} />
          <Text style={styles.dateText}>
            {formatarData(ocorrencia.createdAt)}
          </Text>
        </View>

        <View style={styles.verMaisContainer}>
          <Text style={styles.verMaisText}>Ver detalhes</Text>
          <Ionicons name="chevron-forward" size={14} color={colors.primary} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryBadge: {
    backgroundColor: colors.surfaceSubtle,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  titulo: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 8,
    lineHeight: 22,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 4,
  },
  local: {
    fontSize: 13,
    color: colors.textSecondary,
    flex: 1,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateText: {
    fontSize: 12,
    color: colors.textMuted,
  },
  verMaisContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  verMaisText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
});
