import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { OcorrenciaDetailScreenProps } from '../types/navigation';
import { Ocorrencia, StatusOcorrencia } from '../types/ocorrencia';
import { apiService } from '../services/api';
import { formatarData } from '../utils/date';
import { StatusBadge } from '../components/StatusBadge';
import { LoadingState } from '../components/LoadingState';
import { ErrorState } from '../components/ErrorState';
import { useAuth } from '../context/AuthContext';

export const OcorrenciaDetailScreen: React.FC<OcorrenciaDetailScreenProps> = ({
  route,
  navigation,
}) => {
  const { id, ocorrencia: initialData } = route.params;
  const { token, isAuthenticated } = useAuth();

  const [ocorrencia, setOcorrencia] = useState<Ocorrencia | null>(
    initialData || null
  );
  const [loading, setLoading] = useState<boolean>(!initialData);
  const [notFound, setNotFound] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);

  useEffect(() => {
    // Se não tiver dados iniciais ou para garantir os dados mais recentes do servidor
    const buscarDetalhes = async () => {
      try {
        setLoading(true);
        setNotFound(false);
        setHasError(false);

        const dados = await apiService.getOcorrenciaById(id);
        setOcorrencia(dados);
      } catch (error: any) {
        console.error('Erro ao buscar detalhes da ocorrência:', error);
        if (error.message?.includes('não encontrada')) {
          setNotFound(true);
        } else {
          setHasError(true);
        }
      } finally {
        setLoading(false);
      }
    };

    buscarDetalhes();
  }, [id]);

  const [updatingStatus, setUpdatingStatus] = useState<boolean>(false);

  const handleUpdateStatus = async (novoStatus: StatusOcorrencia) => {
    if (!token) {
      Alert.alert('Acesso Restrito', 'Faça login como administrador para alterar o status.');
      return;
    }

    try {
      setUpdatingStatus(true);
      const atualizada = await apiService.updateOcorrenciaStatus(id, novoStatus, token);
      setOcorrencia(atualizada);
      Alert.alert('Sucesso', 'Status da ocorrência atualizado com sucesso!');
    } catch (error: any) {
      console.error('Erro ao atualizar status na tela de detalhes:', error);
      Alert.alert('Erro', error.message || 'Não foi possível atualizar o status.');
    } finally {
      setUpdatingStatus(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backIconButton}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalhes da Ocorrência</Text>
      </View>

      {loading ? (
        <LoadingState message="Carregando detalhes..." />
      ) : notFound ? (
        <View style={styles.stateContainer}>
          <ErrorState message="Ocorrência não encontrada." />
          <TouchableOpacity
            style={styles.voltarButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
          >
            <Ionicons name="arrow-back" size={18} color={colors.textLight} />
            <Text style={styles.voltarButtonText}>Voltar</Text>
          </TouchableOpacity>
        </View>
      ) : hasError || !ocorrencia ? (
        <View style={styles.stateContainer}>
          <ErrorState
            message="Não foi possível carregar os detalhes da ocorrência."
            onRetry={() => {
              setLoading(true);
              apiService
                .getOcorrenciaById(id)
                .then(setOcorrencia)
                .catch(() => setHasError(true))
                .finally(() => setLoading(false));
            }}
          />
          <TouchableOpacity
            style={styles.voltarOutlineButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
          >
            <Ionicons name="arrow-back" size={18} color={colors.primary} />
            <Text style={styles.voltarOutlineText}>Voltar</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Card Principal */}
          <View style={styles.card}>
            {/* Top row: Categoria e Status */}
            <View style={styles.topRow}>
              <View style={styles.categoriaBadge}>
                <Ionicons name="pricetag-outline" size={14} color={colors.primary} />
                <Text style={styles.categoriaText}>{ocorrencia.categoria}</Text>
              </View>
              <StatusBadge status={ocorrencia.status} />
            </View>

            {/* Título */}
            <Text style={styles.titulo}>{ocorrencia.titulo}</Text>

            {/* Local */}
            <View style={styles.infoRow}>
              <View style={styles.iconCircle}>
                <Ionicons name="location" size={18} color={colors.primary} />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Local</Text>
                <Text style={styles.infoValue}>{ocorrencia.local}</Text>
              </View>
            </View>

            {/* Data de Criação */}
            <View style={styles.infoRow}>
              <View style={styles.iconCircle}>
                <Ionicons name="calendar" size={18} color={colors.primary} />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Data de registro</Text>
                <Text style={styles.infoValue}>
                  {formatarData(ocorrencia.createdAt)}
                </Text>
              </View>
            </View>

            {/* Divisor */}
            <View style={styles.divider} />

            {/* Painel Administrativo de Alteração de Status (Visível apenas quando logado como admin) */}
            {isAuthenticated && (
              <View style={styles.adminControlBox}>
                <View style={styles.adminControlHeader}>
                  <Ionicons name="shield-checkmark" size={16} color={colors.primary} />
                  <Text style={styles.adminControlTitle}>Gestão de Status (Admin)</Text>
                </View>

                {updatingStatus ? (
                  <View style={styles.updatingLoader}>
                    <ActivityIndicator size="small" color={colors.primary} />
                    <Text style={styles.updatingText}>Atualizando status...</Text>
                  </View>
                ) : (
                  <View style={styles.statusButtonsGroup}>
                    {(
                      [
                        { label: 'Registrado', value: 'REGISTRADO' },
                        { label: 'Em Análise', value: 'EM_ANALISE' },
                        { label: 'Resolvido', value: 'RESOLVIDO' },
                      ] as const
                    ).map((option) => {
                      const isCurrent = ocorrencia.status === option.value;
                      return (
                        <TouchableOpacity
                          key={option.value}
                          style={[
                            styles.statusOptionButton,
                            isCurrent && styles.statusOptionButtonActive,
                          ]}
                          onPress={() => {
                            if (!isCurrent) handleUpdateStatus(option.value);
                          }}
                          disabled={isCurrent || updatingStatus}
                          activeOpacity={0.8}
                        >
                          <Text
                            style={[
                              styles.statusOptionText,
                              isCurrent && styles.statusOptionTextActive,
                            ]}
                          >
                            {option.label}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}
                <View style={styles.divider} />
              </View>
            )}

            {/* Descrição */}
            <View style={styles.descriptionContainer}>
              <Text style={styles.descriptionLabel}>Descrição detalhada</Text>
              <Text style={styles.descriptionText}>{ocorrencia.descricao}</Text>
            </View>
          </View>

          {/* Botão Voltar obrigatório */}
          <TouchableOpacity
            style={styles.voltarButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.85}
          >
            <Ionicons name="arrow-back" size={20} color={colors.textLight} />
            <Text style={styles.voltarButtonText}>Voltar</Text>
          </TouchableOpacity>
        </ScrollView>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    backgroundColor: colors.cardBackground,
    gap: 12,
  },
  backIconButton: {
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
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  categoriaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.primaryBackground,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  categoriaText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
  titulo: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
    lineHeight: 28,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '600',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: 16,
  },
  descriptionContainer: {
    gap: 8,
  },
  descriptionLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  descriptionText: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  voltarButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 20,
    elevation: 2,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  voltarButtonText: {
    color: colors.textLight,
    fontSize: 16,
    fontWeight: '700',
  },
  stateContainer: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  voltarOutlineButton: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 12,
  },
  voltarOutlineText: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: '700',
  },
  adminControlBox: {
    backgroundColor: colors.surfaceSubtle,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 4,
  },
  adminControlHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  adminControlTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  updatingLoader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 6,
  },
  updatingText: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '500',
  },
  statusButtonsGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  statusOptionButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 8,
    backgroundColor: colors.cardBackground,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statusOptionButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  statusOptionText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  statusOptionTextActive: {
    color: colors.textLight,
  },
});
