import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { NewOcorrenciaScreenProps } from '../types/navigation';
import { CategoriaOcorrencia } from '../types/ocorrencia';
import { apiService } from '../services/api';
import { CategoryPicker } from '../components/CategoryPicker';
import { validarOcorrencia } from '../utils/validation';

export const NewOcorrenciaScreen: React.FC<NewOcorrenciaScreenProps> = ({
  navigation,
}) => {
  const [titulo, setTitulo] = useState('');
  const [categoria, setCategoria] = useState<CategoriaOcorrencia>('Buraco');
  const [descricao, setDescricao] = useState('');
  const [local, setLocal] = useState('');

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Evita duplo clique rápido
  const isSubmittingRef = useRef(false);
  const redirectTimerRef = useRef<NodeJS.Timeout | null>(null);

  const navigateToOccurrences = () => {
    if (redirectTimerRef.current) {
      clearTimeout(redirectTimerRef.current);
    }
    setIsSuccess(false);
    navigation.navigate('OcorrenciasList');
  };

  const navigateToHome = () => {
    if (redirectTimerRef.current) {
      clearTimeout(redirectTimerRef.current);
    }
    setIsSuccess(false);
    navigation.navigate('Home');
  };

  const handleSubmit = async () => {
    if (isSubmittingRef.current || submitting || isSuccess) {
      return;
    }

    setErrorMessage(null);

    // Validação de campos obrigatórios
    const validacao = validarOcorrencia({
      titulo,
      categoria,
      descricao,
      local,
    });

    if (!validacao.valido) {
      const msg = validacao.mensagem || 'Preencha todos os campos obrigatórios.';
      setErrorMessage(msg);
      Alert.alert('Atenção', msg);
      return;
    }

    try {
      isSubmittingRef.current = true;
      setSubmitting(true);

      await apiService.createOcorrencia({
        titulo: titulo.trim(),
        categoria: categoria.trim(),
        descricao: descricao.trim(),
        local: local.trim(),
      });

      // Limpa os campos para evitar envio de dados duplicados
      setTitulo('');
      setDescricao('');
      setLocal('');
      setCategoria('Buraco');

      // Exibe modal visual de sucesso
      setIsSuccess(true);

      // Redireciona automaticamente após 2.2 segundos para uma experiência fluida
      redirectTimerRef.current = setTimeout(() => {
        navigateToOccurrences();
      }, 2200);
    } catch (error: any) {
      console.error('Erro ao registrar ocorrência:', error);
      const msg =
        error.message === 'Preencha todos os campos obrigatórios.'
          ? error.message
          : 'Não foi possível registrar o problema. Tente novamente.';
      setErrorMessage(msg);
      Alert.alert('Erro', msg);
    } finally {
      isSubmittingRef.current = false;
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header simples */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
              activeOpacity={0.7}
              disabled={submitting}
            >
              <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
            <View>
              <Text style={styles.headerTitle}>Registrar Problema</Text>
              <Text style={styles.headerSubtitle}>
                Preencha os detalhes da ocorrência
              </Text>
            </View>
          </View>

          {/* Banner de Erro */}
          {errorMessage && (
            <View style={styles.errorBanner}>
              <Ionicons name="alert-circle" size={18} color={colors.error} />
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          )}

          {/* Formulário */}
          <View style={styles.formCard}>
            {/* Campo Título */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Título *</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: Buraco na rua"
                placeholderTextColor={colors.textMuted}
                value={titulo}
                onChangeText={(text) => {
                  setTitulo(text);
                  if (errorMessage) setErrorMessage(null);
                }}
                maxLength={100}
                editable={!submitting && !isSuccess}
              />
            </View>

            {/* Campo Categoria */}
            <CategoryPicker
              selectedCategory={categoria}
              onSelectCategory={(cat) => setCategoria(cat)}
            />

            {/* Campo Descrição */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Descrição *</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Ex: Existe um buraco grande próximo à praça."
                placeholderTextColor={colors.textMuted}
                value={descricao}
                onChangeText={(text) => {
                  setDescricao(text);
                  if (errorMessage) setErrorMessage(null);
                }}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                editable={!submitting && !isSuccess}
              />
            </View>

            {/* Campo Local */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Local *</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: Rua das Flores, 120"
                placeholderTextColor={colors.textMuted}
                value={local}
                onChangeText={(text) => {
                  setLocal(text);
                  if (errorMessage) setErrorMessage(null);
                }}
                maxLength={150}
                editable={!submitting && !isSuccess}
              />
            </View>

            {/* Botão Registrar Problema */}
            <TouchableOpacity
              style={[
                styles.submitButton,
                (submitting || isSuccess) && styles.submitButtonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={submitting || isSuccess}
              activeOpacity={0.85}
            >
              {submitting ? (
                <>
                  <ActivityIndicator size="small" color={colors.textLight} />
                  <Text style={styles.submitButtonText}>Registrando ocorrência...</Text>
                </>
              ) : isSuccess ? (
                <>
                  <Ionicons name="checkmark-circle" size={20} color={colors.textLight} />
                  <Text style={styles.submitButtonText}>Registrado com sucesso!</Text>
                </>
              ) : (
                <>
                  <Ionicons name="checkmark-circle-outline" size={20} color={colors.textLight} />
                  <Text style={styles.submitButtonText}>Registrar problema</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Modal Visual de Sucesso */}
      <Modal
        visible={isSuccess}
        transparent={true}
        animationType="fade"
        onRequestClose={navigateToOccurrences}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalIconCircle}>
              <Ionicons name="checkmark-circle" size={68} color={colors.success} />
            </View>

            <Text style={styles.modalTitle}>Problema registrado com sucesso!</Text>
            <Text style={styles.modalSubtitle}>
              Sua ocorrência foi salva no banco de dados e adicionada à lista da comunidade.
            </Text>

            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity
                style={styles.modalPrimaryButton}
                onPress={navigateToOccurrences}
                activeOpacity={0.85}
              >
                <Text style={styles.modalPrimaryButtonText}>Ver ocorrências</Text>
                <Ionicons name="arrow-forward" size={18} color={colors.textLight} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalSecondaryButton}
                onPress={navigateToHome}
                activeOpacity={0.8}
              >
                <Text style={styles.modalSecondaryButtonText}>Voltar ao início</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.cardBackground,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.errorBackground,
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  errorText: {
    color: colors.error,
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  formCard: {
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
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.textPrimary,
  },
  textArea: {
    minHeight: 90,
    paddingTop: 12,
  },
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 10,
    elevation: 2,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  submitButtonDisabled: {
    opacity: 0.75,
    backgroundColor: colors.primaryHover,
  },
  submitButtonText: {
    color: colors.textLight,
    fontSize: 16,
    fontWeight: '700',
  },

  // Modal de Sucesso
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContainer: {
    backgroundColor: colors.cardBackground,
    borderRadius: 20,
    padding: 28,
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  modalIconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 10,
  },
  modalSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  modalButtonsContainer: {
    width: '100%',
    gap: 10,
  },
  modalPrimaryButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    width: '100%',
  },
  modalPrimaryButtonText: {
    color: colors.textLight,
    fontSize: 16,
    fontWeight: '700',
  },
  modalSecondaryButton: {
    backgroundColor: colors.surfaceSubtle,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  modalSecondaryButtonText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
});
