import { useState } from "react";
import {
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  View,
} from "react-native";
import LottieView from "lottie-react-native";
import { YStack, XStack, Text, Button, Input, Sheet } from "tamagui";
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
    <XStack
      backgroundColor="$background"
      padding="$4"
      borderRadius="$4"
      marginBottom="$2"
      alignItems="center"
      gap="$3"
      borderWidth={1}
      borderColor="$borderColor"
      pressStyle={{ opacity: 0.8 }}
      onPress={() => openEdit(item)}
    >
      <TouchableOpacity onPress={() => toggleComplete(item)} style={styles.checkbox}>
        <Text fontSize={18}>{item.completed ? "✅" : "⬜"}</Text>
      </TouchableOpacity>
      <YStack flex={1} gap="$1">
        <Text
          fontSize={16}
          fontWeight="600"
          textDecorationLine={item.completed ? "line-through" : "none"}
          opacity={item.completed ? 0.5 : 1}
        >
          {item.title}
        </Text>
        {item.description ? (
          <Text fontSize={13} color="$color11" numberOfLines={1}>
            {item.description}
          </Text>
        ) : null}
      </YStack>
      <TouchableOpacity onPress={() => handleDelete(item)} style={styles.deleteBtn}>
        <Text fontSize={18}>🗑️</Text>
      </TouchableOpacity>
    </XStack>
  );

  const renderEmpty = () => {
    if (isLoading) return null;
    return (
      <YStack flex={1} alignItems="center" justifyContent="center" padding="$8">
        <LottieView
          source={{ uri: "https://assets2.lottiefiles.com/packages/lf20_vyod6x1h.json" }}
          autoPlay
          loop
          style={{ width: 200, height: 200 }}
        />
        <Text fontSize={16} color="$color11" marginTop="$4">
          No tienes tareas aún
        </Text>
        <Text fontSize={13} color="$color10" marginTop="$2">
          Presiona + para crear una
        </Text>
      </YStack>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <YStack flex={1} padding="$4">
        <XStack alignItems="center" justifyContent="space-between" marginBottom="$4">
          <TouchableOpacity onPress={() => router.back()}>
            <Text fontSize={24}>←</Text>
          </TouchableOpacity>
          <Text fontSize={22} fontWeight="700">
            Mis Tareas
          </Text>
          <View style={{ width: 24 }} />
        </XStack>

        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListEmptyComponent={renderEmpty}
          contentContainerStyle={tasks?.length ? undefined : { flex: 1 }}
          showsVerticalScrollIndicator={false}
        />

        {/* FAB */}
        <TouchableOpacity onPress={openCreate} style={styles.fab}>
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
      </YStack>

      {/* Sheet para crear/editar */}
      <Sheet modal open={open} onOpenChange={setOpen} snapPoints={[45]} dismissOnSnapToBottom>
        <Sheet.Overlay />
        <Sheet.Frame padding="$6">
          <Sheet.Handle />
          <YStack gap="$4" marginTop="$4">
            <Text fontSize={20} fontWeight="700">
              {editing ? "Editar tarea" : "Nueva tarea"}
            </Text>
            <Input
              placeholder="Título"
              value={title}
              onChangeText={setTitle}
              size="$4"
              autoFocus
            />
            <Input
              placeholder="Descripción (opcional)"
              value={description}
              onChangeText={setDescription}
              size="$4"
              multiline
              numberOfLines={3}
              style={{ minHeight: 80, textAlignVertical: "top" }}
            />
            <Button
              onPress={handleSave}
              backgroundColor="$blue9"
              color="white"
              size="$4"
              disabled={createTask.isPending || updateTask.isPending}
            >
              {editing ? "Guardar cambios" : "Crear tarea"}
            </Button>
          </YStack>
        </Sheet.Frame>
      </Sheet>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f5f5f5" },
  checkbox: { padding: 4 },
  deleteBtn: { padding: 8 },
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
});
