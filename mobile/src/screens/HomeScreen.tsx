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
import { HomeScreenProps } from '../types/navigation';
import { Ocorrencia } from '../types/ocorrencia';
import { apiService } from '../services/api';
import { OcorrenciaCard } from '../components/OcorrenciaCard';
import { LoadingState } from '../components/LoadingState';
import { EmptyState } from '../components/EmptyState';
import { useAuth } from '../context/AuthContext';

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { isAuthenticated } = useAuth();
  const [recentes, setRecentes] = useState<Ocorrencia[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);

  const carregarRecentes = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setHasError(false);

    try {
      const dados = await apiService.getOcorrencias();
      // Pega até 3 ocorrências mais recentes
      setRecentes(dados.slice(0, 3));
    } catch (error) {
      console.error('Erro ao carregar ocorrências recentes:', error);
      setHasError(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregarRecentes();
    }, [carregarRecentes])
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primaryHover} />

      <FlatList
        data={recentes}
        keyExtractor={(item) => String(item.id)}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => carregarRecentes(true)}
            colors={[colors.primary]}
          />
        }
        ListHeaderComponent={
          <>
            {/* Header Hero */}
            <View style={styles.heroContainer}>
              <View style={styles.heroTopRow}>
                <View style={styles.heroBadge}>
                  <Ionicons name="people" size={16} color={colors.textLight} />
                  <Text style={styles.heroBadgeText}>Colaboração Cidadã</Text>
                </View>

                <TouchableOpacity
                  style={styles.adminAccessBadge}
                  onPress={() =>
                    navigation.navigate(isAuthenticated ? 'AdminDashboard' : 'AdminLogin')
                  }
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name={isAuthenticated ? 'shield-checkmark' : 'shield-outline'}
                    size={14}
                    color={colors.textLight}
                  />
                  <Text style={styles.adminAccessBadgeText}>
                    {isAuthenticated ? 'Painel ADM' : 'Acesso ADM'}
                  </Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.appName}>Active Community</Text>
              <Text style={styles.appSubtitle}>
                Ajude a melhorar sua comunidade.
              </Text>
              <Text style={styles.appDescription}>
                Identificou um buraco, lixo acumulado ou falta de iluminação?
                Registre a ocorrência e acompanhe os problemas do seu bairro.
              </Text>
            </View>

            {/* Ações Principais */}
            <View style={styles.actionsContainer}>
              {/* Se o administrador estiver autenticado, exibe atalho em destaque */}
              {isAuthenticated && (
                <TouchableOpacity
                  style={styles.adminBannerButton}
                  onPress={() => navigation.navigate('AdminDashboard')}
                  activeOpacity={0.85}
                >
                  <View style={[styles.actionIconContainer, styles.adminBannerIconBg]}>
                    <Ionicons name="shield-checkmark" size={24} color={colors.textLight} />
                  </View>
                  <View style={styles.actionTextContainer}>
                    <Text style={styles.adminBannerTitle}>Painel de Gestão ADM</Text>
                    <Text style={styles.adminBannerSubtitle}>
                      Gerenciar e atualizar status das ocorrências
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={colors.textLight} />
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={styles.primaryActionButton}
                onPress={() => navigation.navigate('NewOcorrencia')}
                activeOpacity={0.85}
              >
                <View style={styles.actionIconContainer}>
                  <Ionicons name="add-circle" size={26} color={colors.textLight} />
                </View>
                <View style={styles.actionTextContainer}>
                  <Text style={styles.primaryActionTitle}>Registrar problema</Text>
                  <Text style={styles.primaryActionSubtitle}>
                    Notifique um novo problema urbano
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.textLight} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryActionButton}
                onPress={() => navigation.navigate('OcorrenciasList')}
                activeOpacity={0.85}
              >
                <View style={[styles.actionIconContainer, styles.secondaryIconBg]}>
                  <Ionicons name="list" size={24} color={colors.primary} />
                </View>
                <View style={styles.actionTextContainer}>
                  <Text style={styles.secondaryActionTitle}>Ver ocorrências</Text>
                  <Text style={styles.secondaryActionSubtitle}>
                    Consulte todos os registros da comunidade
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            {/* Cabeçalho da Lista Recente */}
            <View style={styles.sectionHeader}>
              <View style={styles.sectionHeaderLeft}>
                <Ionicons name="flash-outline" size={18} color={colors.primary} />
                <Text style={styles.sectionTitle}>Ocorrências Recentes</Text>
              </View>
              {recentes.length > 0 && (
                <TouchableOpacity
                  onPress={() => navigation.navigate('OcorrenciasList')}
                  activeOpacity={0.7}
                >
                  <Text style={styles.seeAllText}>Ver todas</Text>
                </TouchableOpacity>
              )}
            </View>

            {loading && !refreshing && (
              <LoadingState message="Buscando ocorrências recentes..." />
            )}
          </>
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
          !loading ? (
            <EmptyState
              message="Nenhum problema registrado ainda."
              actionText="Registrar o primeiro"
              onActionPress={() => navigation.navigate('NewOcorrencia')}
            />
          ) : null
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    paddingBottom: 24,
  },
  heroContainer: {
    backgroundColor: colors.primary,
    paddingTop: 32,
    paddingBottom: 36,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    elevation: 4,
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 6,
  },
  heroBadgeText: {
    color: colors.textLight,
    fontSize: 12,
    fontWeight: '600',
  },
  adminAccessBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.35)',
    gap: 5,
  },
  adminAccessBadgeText: {
    color: colors.textLight,
    fontSize: 11,
    fontWeight: '700',
  },
  appName: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.textLight,
    letterSpacing: -0.5,
  },
  appSubtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#E0E7FF',
    marginTop: 4,
  },
  appDescription: {
    fontSize: 14,
    color: '#CBD5E1',
    marginTop: 10,
    lineHeight: 20,
  },
  actionsContainer: {
    paddingHorizontal: 16,
    marginTop: -20,
    gap: 12,
  },
  adminBannerButton: {
    backgroundColor: colors.primaryDark,
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  adminBannerIconBg: {
    backgroundColor: '#F59E0B',
  },
  adminBannerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textLight,
  },
  adminBannerSubtitle: {
    fontSize: 12,
    color: '#E0E7FF',
  },
  primaryActionButton: {
    backgroundColor: colors.primaryHover,
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
  },
  secondaryActionButton: {
    backgroundColor: colors.cardBackground,
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  actionIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  secondaryIconBg: {
    backgroundColor: colors.primaryBackground,
  },
  actionTextContainer: {
    flex: 1,
  },
  primaryActionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textLight,
  },
  primaryActionSubtitle: {
    fontSize: 12,
    color: '#E2E8F0',
    marginTop: 2,
  },
  secondaryActionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  secondaryActionSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 24,
    marginBottom: 12,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
});
