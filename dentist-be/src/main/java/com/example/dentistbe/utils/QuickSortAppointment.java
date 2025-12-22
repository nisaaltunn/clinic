package com.example.dentistbe.utils;

import com.example.dentistbe.model.Appointment;

import java.time.LocalDateTime;
import java.util.List;

public class QuickSortAppointment {

    // ✅ Service katmanından çağıracağımız METOT
    public static void sortByStartTime(List<Appointment> list) {
        if (list == null || list.size() <= 1) return;
        quickSortByStartTime(list, 0, list.size() - 1);
    }

    private static void quickSortByStartTime(
            List<Appointment> list,
            int low,
            int high
    ) {
        if (low < high) {
            int pi = partition(list, low, high);
            quickSortByStartTime(list, low, pi - 1);
            quickSortByStartTime(list, pi + 1, high);
        }
    }

    private static int partition(
            List<Appointment> list,
            int low,
            int high
    ) {
        LocalDateTime pivot = list.get(high).getStartTime();
        int i = low - 1;

        for (int j = low; j < high; j++) {
            if (list.get(j).getStartTime().isBefore(pivot)) {
                i++;
                swap(list, i, j);
            }
        }
        swap(list, i + 1, high);
        return i + 1;
    }

    private static void swap(
            List<Appointment> list,
            int i,
            int j
    ) {
        Appointment temp = list.get(i);
        list.set(i, list.get(j));
        list.set(j, temp);
    }
}
