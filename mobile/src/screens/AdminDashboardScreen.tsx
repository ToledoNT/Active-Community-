import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Platform,
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
import { AdminDashboardScreenProps } from '../types/navigation';
import { Ocorrencia, StatusOcorrencia } from '../types/ocorrencia';
import { apiService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatarData } from '../utils/date';
import { StatusBadge } from '../components/StatusBadge';
import { LoadingState } from '../components/LoadingState';
import { EmptyState } from '../components/EmptyState';

const STATUS_OPTIONS: { label: string; value: StatusOcorrencia; icon: keyof typeof Ionicons.glyphMap }[] = [
  { label: 'Registrado', value: 'REGISTRADO', icon: 'bookmark-outline' },
  { label: 'Em Análise', value: 'EM_ANALISE', icon: 'hourglass-outline' },
  { label: 'Resolvido', value: 'RESOLVIDO', icon: 'checkmark-circle-outline' },
];

export const AdminDashboardScreen: React.FC<AdminDashboardScreenProps> = ({
  navigation,
}) => {
  const { admin, token, logout } = useAuth();
  const [ocorrencias, setOcorrencias] = useState<Ocorrencia[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [filtroStatus, setFiltroStatus] = useState<StatusOcorrencia | 'TODAS'>('TODAS');
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const carregarOcorrencias = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const dados = await apiService.getOcorrencias();
      setOcorrencias(dados);
    } catch (error) {
      console.error('Erro ao listar ocorrências no painel admin:', error);
      Alert.alert('Erro', 'Não foi possível carregar as ocorrências.');
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

  const handleUpdateStatus = async (ocorrenciaId: number, novoStatus: StatusOcorrencia) => {
    if (!token) {
      Alert.alert('Sessão expirada', 'Faça login novamente.');
      navigation.replace('AdminLogin');
      return;
    }

    try {
      setUpdatingId(ocorrenciaId);
      const ocorrenciaAtualizada = await apiService.updateOcorrenciaStatus(
        ocorrenciaId,
        novoStatus,
        token
      );

      // Atualiza o item na lista local
      setOcorrencias((prev) =>
        prev.map((item) => (item.id === ocorrenciaId ? ocorrenciaAtualizada : item))
      );
    } catch (error: any) {
      console.error('Erro ao atualizar status:', error);
      Alert.alert(
        'Erro ao alterar status',
        error.message || 'Não foi possível atualizar o status da ocorrência.'
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const executarLogout = async () => {
    try {
      await logout();
    } catch (e) {
      console.error('Erro ao realizar logout:', e);
    } finally {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });
    }
  };

  const handleLogout = () => {
    if (Platform.OS === 'web') {
      const confirmou = window.confirm('Deseja realmente encerrar a sessão de administrador?');
      if (confirmou) {
        executarLogout();
      }
      return;
    }

    Alert.alert(
      'Sair da Administração',
      'Deseja realmente encerrar a sessão de administrador?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: executarLogout,
        },
      ]
    );
  };

  const ocorrenciasFiltradas = ocorrencias.filter((item) => {
    if (filtroStatus === 'TODAS') return true;
    return item.status === filtroStatus;
  });

  const totalRegistrado = ocorrencias.filter((o) => o.status === 'REGISTRADO').length;
  const totalEmAnalise = ocorrencias.filter((o) => o.status === 'EM_ANALISE').length;
  const totalResolvido = ocorrencias.filter((o) => o.status === 'RESOLVIDO').length;

  const renderOcorrenciaItem = ({ item }: { item: Ocorrencia }) => {
    const isUpdating = updatingId === item.id;

    return (
      <View style={styles.card}>
        {/* Cabeçalho do Card */}
        <TouchableOpacity
          onPress={() => navigation.navigate('OcorrenciaDetail', { id: item.id, ocorrencia: item })}
          activeOpacity={0.7}
        >
          <View style={styles.cardHeader}>
            <View style={styles.categoriaPill}>
              <Ionicons name="pricetag-outline" size={13} color={colors.primary} />
              <Text style={styles.categoriaPillText}>{item.categoria}</Text>
            </View>
            <StatusBadge status={item.status} />
          </View>

          <Text style={styles.cardTitle}>{item.titulo}</Text>

          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={15} color={colors.textSecondary} />
            <Text style={styles.infoText} numberOfLines={1}>
              {item.local}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={15} color={colors.textMuted} />
            <Text style={styles.dateText}>{formatarData(item.createdAt)}</Text>
          </View>
        </TouchableOpacity>

        {/* Divisor */}
        <View style={styles.cardDivider} />

        {/* Barra de Ações para Alteração de Status */}
        <View style={styles.statusActionSection}>
          <Text style={styles.statusActionLabel}>Alterar Status:</Text>

          {isUpdating ? (
            <View style={styles.updatingLoader}>
              <ActivityIndicator size="small" color={colors.primary} />
              <Text style={styles.updatingText}>Atualizando status...</Text>
            </View>
          ) : (
            <View style={styles.statusButtonsGroup}>
              {STATUS_OPTIONS.map((option) => {
                const isCurrent = item.status === option.value;
                return (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.statusOptionButton,
                      isCurrent && styles.statusOptionButtonActive,
                    ]}
                    onPress={() => {
                      if (!isCurrent) {
                        handleUpdateStatus(item.id, option.value);
                      }
                    }}
                    disabled={isCurrent}
                    activeOpacity={0.75}
                  >
                    <Ionicons
                      name={option.icon}
                      size={14}
                      color={isCurrent ? colors.textLight : colors.textSecondary}
                    />
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
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark} />

      {/* Header Superior Administrativo */}
      <View style={styles.topHeader}>
        <View style={styles.headerTitleRow}>
          <TouchableOpacity
            style={styles.headerIconButton}
            onPress={() => navigation.navigate('Home')}
            activeOpacity={0.8}
          >
            <Ionicons name="home-outline" size={20} color={colors.textLight} />
          </TouchableOpacity>

          <View style={styles.headerTextGroup}>
            <View style={styles.adminBadge}>
              <Ionicons name="shield-checkmark" size={14} color={colors.textLight} />
              <Text style={styles.adminBadgeText}>Área Administrativa</Text>
            </View>
            <Text style={styles.adminWelcomeText}>
              Olá, {admin?.nome || 'Administrador'}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            activeOpacity={0.8}
            accessibilityLabel="Sair da administração"
          >
            <Ionicons name="log-out-outline" size={18} color={colors.textLight} />
            <Text style={styles.logoutButtonText}>Sair</Text>
          </TouchableOpacity>
        </View>

        {/* Resumo Rápido de Métricas */}
        <View style={styles.metricsContainer}>
          <View style={styles.metricCard}>
            <Text style={styles.metricNumber}>{ocorrencias.length}</Text>
            <Text style={styles.metricLabel}>Total</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={[styles.metricNumber, { color: '#3B82F6' }]}>{totalRegistrado}</Text>
            <Text style={styles.metricLabel}>Registrados</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={[styles.metricNumber, { color: '#F59E0B' }]}>{totalEmAnalise}</Text>
            <Text style={styles.metricLabel}>Em Análise</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={[styles.metricNumber, { color: '#10B981' }]}>{totalResolvido}</Text>
            <Text style={styles.metricLabel}>Resolvidos</Text>
          </View>
        </View>
      </View>

      {/* Barra de Filtros */}
      <View style={styles.filtersBar}>
        {(['TODAS', 'REGISTRADO', 'EM_ANALISE', 'RESOLVIDO'] as const).map((status) => {
          const isActive = filtroStatus === status;
          const labels: Record<string, string> = {
            TODAS: 'Todas',
            REGISTRADO: 'Registrado',
            EM_ANALISE: 'Em Análise',
            RESOLVIDO: 'Resolvido',
          };

          return (
            <TouchableOpacity
              key={status}
              style={[styles.filterChip, isActive && styles.filterChipActive]}
              onPress={() => setFiltroStatus(status)}
              activeOpacity={0.7}
            >
              <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
                {labels[status]}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Listagem */}
      {loading ? (
        <LoadingState message="Carregando ocorrências..." />
      ) : ocorrenciasFiltradas.length === 0 ? (
        <View style={styles.emptyContainer}>
          <EmptyState
            message="Nenhuma ocorrência encontrada para o filtro selecionado."
            actionText="Recarregar"
            onActionPress={() => carregarOcorrencias(true)}
          />
          <TouchableOpacity
            style={styles.footerLogoutButton}
            onPress={handleLogout}
            activeOpacity={0.85}
          >
            <Ionicons name="log-out-outline" size={20} color={colors.error} />
            <Text style={styles.footerLogoutText}>Sair da Administração</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={ocorrenciasFiltradas}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderOcorrenciaItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            <View style={styles.footerLogoutContainer}>
              <TouchableOpacity
                style={styles.footerLogoutButton}
                onPress={handleLogout}
                activeOpacity={0.85}
              >
                <Ionicons name="log-out-outline" size={20} color={colors.error} />
                <Text style={styles.footerLogoutText}>Sair da Administração</Text>
              </TouchableOpacity>
            </View>
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => carregarOcorrencias(true)}
              colors={[colors.primary]}
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
  topHeader: {
    backgroundColor: colors.primaryDark,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerIconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTextGroup: {
    alignItems: 'center',
  },
  adminBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    gap: 4,
    marginBottom: 2,
  },
  adminBadgeText: {
    color: colors.textLight,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  adminWelcomeText: {
    color: colors.textLight,
    fontSize: 15,
    fontWeight: '600',
  },
  logoutButton: {
    paddingHorizontal: 12,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  logoutButtonText: {
    color: colors.textLight,
    fontSize: 13,
    fontWeight: '700',
  },
  metricsContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 12,
    padding: 8,
    justifyContent: 'space-between',
  },
  metricCard: {
    flex: 1,
    alignItems: 'center',
  },
  metricNumber: {
    color: colors.textLight,
    fontSize: 18,
    fontWeight: '800',
  },
  metricLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 11,
    marginTop: 2,
    fontWeight: '500',
  },
  filtersBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  filterChipTextActive: {
    color: colors.textLight,
  },
  listContent: {
    padding: 16,
    gap: 14,
  },
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoriaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  categoriaPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  infoText: {
    fontSize: 13,
    color: colors.textSecondary,
    flex: 1,
  },
  dateText: {
    fontSize: 12,
    color: colors.textMuted,
  },
  cardDivider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: 12,
  },
  statusActionSection: {
    marginTop: 2,
  },
  statusActionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 8,
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
    gap: 6,
  },
  statusOptionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 7,
    paddingHorizontal: 4,
    borderRadius: 8,
    backgroundColor: colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 4,
  },
  statusOptionButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  statusOptionText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  statusOptionTextActive: {
    color: colors.textLight,
  },
  emptyContainer: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  footerLogoutContainer: {
    marginTop: 18,
    marginBottom: 28,
  },
  footerLogoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.cardBackground,
    borderWidth: 1,
    borderColor: '#FCA5A5',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  footerLogoutText: {
    color: colors.error,
    fontSize: 14,
    fontWeight: '700',
  },
});
