import { useState } from "react";
import {
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  View,
  Text,
  TextInput,
  Modal,
} from "react-native";
import LottieView from "lottie-react-native";
import { router } from "expo-router";
import { useTasks } from "@/features/tasks/model/useTasks";
import { useCreateTask } from "@/features/tasks/model/useCreateTask";
import { useUpdateTask } from "@/features/tasks/model/useUpdateTask";
import { useDeleteTask } from "@/features/tasks/model/useDeleteTask";
import type { Task } from "@/entities/task/model/types";

export const TasksPage = () => {
  const { data: tasks, isLoading } = useTasks();
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const openCreate = () => {
    setEditing(null);
    setTitle("");
    setDescription("");
    setOpen(true);
  };

  const openEdit = (task: Task) => {
    setEditing(task);
    setTitle(task.title);
    setDescription(task.description ?? "");
    setOpen(true);
  };

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert("Campo requerido", "El título es obligatorio.");
      return;
    }
    const payload = { title: title.trim(), description: description.trim() || undefined };
    if (editing) {
      updateTask.mutate({ id: editing.id, ...payload });
    } else {
      createTask.mutate(payload);
    }
    setOpen(false);
  };

  const toggleComplete = (task: Task) => {
    updateTask.mutate({ id: task.id, completed: !task.completed });
  };

  const handleDelete = (task: Task) => {
    Alert.alert("Eliminar tarea", `¿Eliminar "${task.title}"?`, [
      { text: "Cancelar", style: "cancel" },
      { text: "Eliminar", style: "destructive", onPress: () => deleteTask.mutate(task.id) },
    ]);
  };

  const renderItem = ({ item }: { item: Task }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => openEdit(item)}
      style={styles.taskItem}
    >
      <TouchableOpacity onPress={() => toggleComplete(item)} style={styles.checkbox}>
        <Text style={styles.checkboxText}>{item.completed ? "✅" : "⬜"}</Text>
      </TouchableOpacity>
      <View style={styles.taskContent}>
        <Text
          style={[
            styles.taskTitle,
            {
              textDecorationLine: item.completed ? "line-through" : "none",
              opacity: item.completed ? 0.5 : 1,
            },
          ]}
        >
          {item.title}
        </Text>
        {item.description ? (
          <Text style={styles.taskDescription} numberOfLines={1}>
            {item.description}
          </Text>
        ) : null}
      </View>
      <TouchableOpacity onPress={() => handleDelete(item)} style={styles.deleteBtn}>
        <Text style={styles.deleteBtnText}>🗑️</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderEmpty = () => {
    if (isLoading) return null;
    return (
      <View style={styles.emptyContainer}>
        <LottieView
          source={{ uri: "https://assets2.lottiefiles.com/packages/lf20_vyod6x1h.json" }}
          autoPlay
          loop
          style={{ width: 200, height: 200 }}
        />
        <Text style={styles.emptyTitle}>No tienes tareas aún</Text>
        <Text style={styles.emptySubtitle}>Presiona + para crear una</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Mis Tareas</Text>
          <View style={{ width: 24 }} />
        </View>

        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListEmptyComponent={renderEmpty}
          contentContainerStyle={tasks?.length ? undefined : { flex: 1 }}
          showsVerticalScrollIndicator={false}
        />

        <TouchableOpacity onPress={openCreate} style={styles.fab}>
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={open} animationType="slide" transparent onRequestClose={() => setOpen(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHandle} />
            <View style={styles.modalBody}>
              <Text style={styles.modalTitle}>
                {editing ? "Editar tarea" : "Nueva tarea"}
              </Text>
              <TextInput
                placeholder="Título"
                value={title}
                onChangeText={setTitle}
                autoFocus
                style={styles.input}
              />
              <TextInput
                placeholder="Descripción (opcional)"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={3}
                style={[styles.input, styles.textArea]}
              />
              <TouchableOpacity
                onPress={handleSave}
                disabled={createTask.isPending || updateTask.isPending}
                style={styles.saveBtn}
              >
                <Text style={styles.saveBtnText}>
                  {editing ? "Guardar cambios" : "Crear tarea"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f5f5f5" },
  container: { flex: 1, padding: 16 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  backArrow: { fontSize: 24 },
  headerTitle: { fontSize: 22, fontWeight: "700" },
  taskItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  checkbox: { padding: 4 },
  checkboxText: { fontSize: 18 },
  taskContent: { flex: 1, gap: 4 },
  taskTitle: { fontSize: 16, fontWeight: "600" },
  taskDescription: { fontSize: 13, color: "#666" },
  deleteBtn: { padding: 8 },
  deleteBtnText: { fontSize: 18 },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  emptyTitle: { fontSize: 16, color: "#666", marginTop: 16 },
  emptySubtitle: { fontSize: 13, color: "#888", marginTop: 8 },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#1B3A6B",
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  fabText: { color: "#fff", fontSize: 28, lineHeight: 30 },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    minHeight: 300,
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#ddd",
    alignSelf: "center",
    marginBottom: 8,
  },
  modalBody: { gap: 16, marginTop: 8 },
  modalTitle: { fontSize: 20, fontWeight: "700" },
  input: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fafafa",
  },
  textArea: { minHeight: 80, textAlignVertical: "top" },
  saveBtn: {
    backgroundColor: "#1B3A6B",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  saveBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
