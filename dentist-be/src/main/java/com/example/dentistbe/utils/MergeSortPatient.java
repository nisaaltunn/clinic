package com.example.dentistbe.utils;

import com.example.dentistbe.model.Patient;

import java.util.ArrayList;
import java.util.List;

public class MergeSortPatient {

    public static void sortByTc(List<Patient> list) {
        if (list.size() <= 1) return;

        int mid = list.size() / 2;

        List<Patient> left = new ArrayList<>(list.subList(0, mid));
        List<Patient> right = new ArrayList<>(list.subList(mid, list.size()));

        sortByTc(left);
        sortByTc(right);

        merge(list, left, right);
    }

    private static void merge(
            List<Patient> result,
            List<Patient> left,
            List<Patient> right
    ) {
        int i = 0, j = 0, k = 0;

        while (i < left.size() && j < right.size()) {
            if (left.get(i).getTcNo()
                    .compareTo(right.get(j).getTcNo()) <= 0) {
                result.set(k++, left.get(i++));
            } else {
                result.set(k++, right.get(j++));
            }
        }

        while (i < left.size()) {
            result.set(k++, left.get(i++));
        }

        while (j < right.size()) {
            result.set(k++, right.get(j++));
        }
    }
}
