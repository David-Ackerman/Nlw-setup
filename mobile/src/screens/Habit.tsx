import { useRoute } from "@react-navigation/native";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Alert, ScrollView, Text, View } from "react-native";
import clsx from "clsx";
import { BackButton } from "../components/BackButton";
import { Checkbox } from "../components/Checkbox";
import { HabitsEmpty } from "../components/HabitsEmpty";
import { Loading } from "../components/Loading";
import { ProgressBar } from "../components/ProgressBar";
import { api } from "../lib/axios";
import { generateProgressPercentage } from "../utils/generate-progress-percentage";

interface Params {
  date: string;
}

interface DayInfo {
  completedHabits: string[];
  possibleHabits: Array<{
    id: string;
    title: string;
  }>;
}

export function Habit() {
  const route = useRoute();
  const [loading, setLoading] = useState(true);
  const [dayInfo, setDayInfo] = useState<DayInfo | null>(null);
  const [completedHabits, setComletedHabits] = useState<string[]>([]);
  const { date } = route.params as Params;

  const parsedDate = dayjs(date);
  const isDateInPast = parsedDate.endOf("day").isBefore(new Date());
  const dayOfWeek = parsedDate.format("dddd");
  const dayAndMonth = parsedDate.format("DD/MM");

  const habitsProgress = dayInfo?.possibleHabits.length
    ? generateProgressPercentage(
        dayInfo.possibleHabits.length,
        completedHabits.length
      )
    : 0;

  async function searchDayHabits() {
    try {
      setLoading(true);

      const response = await api.get("/day", { params: { date } });
      setDayInfo(response.data);
      setComletedHabits(response.data.completedHabits);
    } catch (error) {
      console.error(error);
      Alert.alert(
        "Ops",
        "não foi possível carregar as informações dos habitos"
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleHabit(habitId: string) {
    try {
      await api.patch(`/habits/${habitId}/toggle`);
      if (completedHabits.includes(habitId)) {
        setComletedHabits((prevState) =>
          prevState.filter((habit) => habit !== habitId)
        );
      } else {
        setComletedHabits((prevState) => [...prevState, habitId]);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Ops", "Não foi possível atualizar o status do hábito");
    }
  }

  useEffect(() => {
    searchDayHabits();
  }, []);

  if (loading) return <Loading />;

  return (
    <View className='flex-1 bg-background px-8 pt-16'>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <BackButton />

        <Text className='mt-6 text-zinc-400 font-semibold text-base lowercase'>
          {dayOfWeek}
        </Text>
        <Text className='text-white font-extrabold text-3xl'>
          {dayAndMonth}
        </Text>

        <ProgressBar progress={habitsProgress} />

        <View className={clsx("mt-6", { "opacity-50": isDateInPast })}>
          {dayInfo?.completedHabits ? (
            dayInfo?.possibleHabits.map((habit) => (
              <Checkbox
                key={habit.id}
                title={habit.title}
                disabled={isDateInPast}
                onPress={() => {
                  handleToggleHabit(habit.id);
                }}
                checked={completedHabits.includes(habit.id)}
              />
            ))
          ) : (
            <HabitsEmpty />
          )}
        </View>
        {isDateInPast && (
          <Text className='text-white mt-10 text-center'>
            Não é possível editar hábitos de uma data passada.
          </Text>
        )}
      </ScrollView>
    </View>
  );
}
