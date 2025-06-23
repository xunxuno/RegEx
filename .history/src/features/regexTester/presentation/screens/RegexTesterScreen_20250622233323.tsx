import React from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform} from 'react-native';
import { RegexInput } from '../../components/atoms/RegexInput';
import { TestTextInput } from '../../components/atoms/TestTextInput';
import { MatchResult } from '../../components/molecules/MatchResult';
import { useRegexTesterViewModel } from '../viewmodel/useRegexTesterViewModel';


export const RegexTesterScreen: React.FC = () => {
  const {
    regex,
    testText,
    setRegex,
    setTestText,
    matches
  } = useRegexTesterViewModel();

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.section}>
          <RegexInput value={regex} onChange={setRegex} />
          <TestTextInput value={testText} onChange={setTestText} />
        </View>

        <View style={styles.matchSection}>
          <MatchResult text={testText} matches={matches} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    padding: 20,
    flexGrow: 1,
    justifyContent: 'flex-start',
  },
  section: {
    marginBottom: 20,
  },
  matchSection: {
    minHeight: 80,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 10,
    backgroundColor: '#fafafa',
  },
});
