import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { StatusOcorrencia } from '../types/ocorrencia';

interface StatusBadgeProps {
  status: StatusOcorrencia | string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const currentStatusConfig =
    colors.status[status as StatusOcorrencia] || colors.status.REGISTRADO;

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: currentStatusConfig.background,
          borderColor: currentStatusConfig.border,
        },
      ]}
    >
      <View
        style={[
          styles.dot,
          { backgroundColor: currentStatusConfig.text },
        ]}
      />
      <Text
        style={[
          styles.label,
          { color: currentStatusConfig.text },
        ]}
      >
        {currentStatusConfig.label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
  },
});
