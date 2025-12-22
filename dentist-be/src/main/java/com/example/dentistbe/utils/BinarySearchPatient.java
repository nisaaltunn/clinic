package com.example.dentistbe.utils;

import com.example.dentistbe.model.Patient;

import java.util.List;

public class BinarySearchPatient {

    public static Patient searchByTc(List<Patient> patients, String tc) {

        int left = 0;
        int right = patients.size() - 1;

        while (left <= right) {
            int mid = (left + right) / 2;

            int cmp = patients.get(mid).getTcNo().compareTo(tc);

            if (cmp == 0) {
                return patients.get(mid);
            } else if (cmp < 0) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }

        return null;
    }
}
