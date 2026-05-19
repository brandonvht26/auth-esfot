import { useState } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import type { ReactNode } from "react";

interface InputProps {
  label:           string;
  value:           string;
  onChangeText:    (t: string) => void;
  placeholder?:    string;
  secureTextEntry?: boolean;
  keyboardType?:   "default" | "email-address" | "numeric";
  error?:          string;
  autoCapitalize?: "none" | "sentences" | "words";
  rightElement?:   ReactNode;
}

export const Input = ({
  label, value, onChangeText, placeholder,
  secureTextEntry, keyboardType = "default", error,
  autoCapitalize = "none", rightElement,
}: InputProps) => {
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputRow, focused && styles.inputFocused, error && styles.inputError]}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#94A3B8"
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={false}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={styles.input}
        />
        {rightElement}
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper:     { gap:6 },
  inputRow:    { flexDirection:"row", alignItems:"center",
                 borderWidth:1.5, borderColor:"#CBD5E1", borderRadius:10,
                 backgroundColor:"#F8FAFC" },
  inputFocused:{ borderColor:"#1B3A6B" },
  inputError:  { borderColor:"#DC2626" },
  input:       { flex:1, paddingHorizontal:16, paddingVertical:13,
                 fontSize:15, color:"#0F172A" },
  error:       { fontSize:12, color:"#DC2626" },
});
