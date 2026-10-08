import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ocorrencia } from './ocorrencia';

export type RootStackParamList = {
  Home: undefined;
  NewOcorrencia: undefined;
  OcorrenciasList: undefined;
  OcorrenciaDetail: { id: number; ocorrencia?: Ocorrencia };
  AdminLogin: undefined;
  AdminDashboard: undefined;
};

export type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;
export type NewOcorrenciaScreenProps = NativeStackScreenProps<RootStackParamList, 'NewOcorrencia'>;
export type OcorrenciasListScreenProps = NativeStackScreenProps<RootStackParamList, 'OcorrenciasList'>;
export type OcorrenciaDetailScreenProps = NativeStackScreenProps<RootStackParamList, 'OcorrenciaDetail'>;
export type AdminLoginScreenProps = NativeStackScreenProps<RootStackParamList, 'AdminLogin'>;
export type AdminDashboardScreenProps = NativeStackScreenProps<RootStackParamList, 'AdminDashboard'>;
