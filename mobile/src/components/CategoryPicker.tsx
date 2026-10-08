import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../theme/colors';
import { CATEGORIAS_DISPONIVEIS, CategoriaOcorrencia } from '../types/ocorrencia';

interface CategoryPickerProps {
  selectedCategory: string;
  onSelectCategory: (category: CategoriaOcorrencia) => void;
}

export const CategoryPicker: React.FC<CategoryPickerProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Categoria *</Text>
      <View style={styles.chipsContainer}>
        {CATEGORIAS_DISPONIVEIS.map((categoria) => {
          const isSelected = selectedCategory === categoria;
          return (
            <TouchableOpacity
              key={categoria}
              style={[
                styles.chip,
                isSelected && styles.chipSelected,
              ]}
              onPress={() => onSelectCategory(categoria)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.chipText,
                  isSelected && styles.chipTextSelected,
                ]}
              >
                {categoria}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  chipTextSelected: {
    color: colors.textLight,
    fontWeight: '700',
  },
});
