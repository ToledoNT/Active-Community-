import React, { useCallback, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { OcorrenciasListScreenProps } from '../types/navigation';
import { Ocorrencia } from '../types/ocorrencia';
import { apiService } from '../services/api';
import { OcorrenciaCard } from '../components/OcorrenciaCard';
import { LoadingState } from '../components/LoadingState';
import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';

export const OcorrenciasListScreen: React.FC<OcorrenciasListScreenProps> = ({
  navigation,
}) => {
  const [ocorrencias, setOcorrencias] = useState<Ocorrencia[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const carregarOcorrencias = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setErrorMessage(null);

    try {
      const dados = await apiService.getOcorrencias();
      setOcorrencias(dados);
    } catch (error: any) {
      console.error('Erro ao listar ocorrências:', error);
      setErrorMessage(
        error.message || 'Não foi possível carregar as ocorrências.'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregarOcorrencias();
    }, [carregarOcorrencias])
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Ocorrências</Text>
            <Text style={styles.headerSubtitle}>
              Problemas reportados na comunidade
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.newButton}
          onPress={() => navigation.navigate('NewOcorrencia')}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={22} color={colors.textLight} />
        </TouchableOpacity>
      </View>

      {/* Contador de ocorrências */}
      {!loading && !errorMessage && (
        <View style={styles.counterRow}>
          <Text style={styles.counterText}>
            {ocorrencias.length === 0
              ? 'Nenhum registro'
              : `${ocorrencias.length} ${
                  ocorrencias.length === 1 ? 'ocorrência encontrada' : 'ocorrências encontradas'
                }`}
          </Text>
        </View>
      )}

      {/* Conteúdo Principal */}
      {loading && !refreshing ? (
        <LoadingState message="Buscando ocorrências..." />
      ) : errorMessage ? (
        <ErrorState
          message="Não foi possível carregar as ocorrências."
          onRetry={() => carregarOcorrencias(false)}
        />
      ) : (
        <FlatList
          data={ocorrencias}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => carregarOcorrencias(true)}
              colors={[colors.primary]}
            />
          }
          renderItem={({ item }) => (
            <OcorrenciaCard
              ocorrencia={item}
              onPress={() =>
                navigation.navigate('OcorrenciaDetail', {
                  id: item.id,
                  ocorrencia: item,
                })
              }
            />
          )}
          ListEmptyComponent={
            <EmptyState
              message="Nenhum problema registrado ainda."
              actionText="Registrar problema"
              onActionPress={() => navigation.navigate('NewOcorrencia')}
            />
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    backgroundColor: colors.cardBackground,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  newButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  counterRow: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  counterText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
});
