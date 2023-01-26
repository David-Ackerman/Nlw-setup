import { useFocusEffect, useNavigation } from "@react-navigation/native";
import dayjs from "dayjs";
import { StyleSheetRuntime } from "nativewind/dist/style-sheet";
import { useCallback, useEffect, useState } from "react";
import { Alert, ScrollView, Text, View } from "react-native";
import { DAY_SIZE, HabitDay } from "../components/HabitDay";

import { Header } from "../components/Header";
import { Loading } from "../components/Loading";
import { api } from "../lib/axios";
import { generateRangeDatesFromYearStart } from "../utils/generate-range-between-dates";

const weekDays = ["D", "S", "T", "Q", "Q", "S", "S"];
const datesFromYearStart = generateRangeDatesFromYearStart();
const minimumSummaryDatesSize = 14 * 5;
const amountOfDaysToFill = minimumSummaryDatesSize - datesFromYearStart.length;

type Summary = Array<{
  id: string;
  date: string;
  amount: number;
  completed: number;
}>;

export function Home() {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<Summary>([]);
  const { navigate } = useNavigation();

  async function getHabitsSummary() {
    try {
      setLoading(true);
      const response = await api.get("/summary");
      setSummary(response.data);
    } catch (error) {
      Alert.alert("Ops", "Não foi possível carregar so sumário de hábitos ");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      getHabitsSummary();
    }, [])
  );

  if (loading) return <Loading />;

  return (
    <View className='flex-1 bg-background px-8 pt-16'>
      <Header />
      <View className='flex-row mt-6 mb-2'>
        {weekDays.map((weekDay, i) => (
          <Text
            key={`${weekDay}-${i}`}
            className='text-zinc-400 text-xl font-bold text-center mx-1'
            style={{ width: DAY_SIZE }}
          >
            {weekDay}
          </Text>
        ))}
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View className='flex-row flex-wrap'>
          {datesFromYearStart.map((date) => {
            const dayWithHabits = summary.find((day) => {
              return dayjs(date).isSame(day.date, "day");
            });
            return (
              <HabitDay
                key={date.toISOString()}
                date={date}
                amountCompleted={dayWithHabits?.completed}
                amountOfHabits={dayWithHabits?.amount}
                onPress={() => {
                  navigate("habit", { date: date.toISOString() });
                }}
              />
            );
          })}
          {amountOfDaysToFill > 0 &&
            Array.from({ length: amountOfDaysToFill }).map((_, index) => (
              <View
                key={index}
                style={{ width: DAY_SIZE, height: DAY_SIZE }}
                className='bg-zinc-900 rounded-lg border-2 m-1 border-zinc-800 opacity-40'
              />
            ))}
        </View>
      </ScrollView>
    </View>
  );
}
