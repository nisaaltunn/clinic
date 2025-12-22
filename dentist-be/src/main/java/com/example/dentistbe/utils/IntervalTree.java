package com.example.dentistbe.utils;



import java.time.LocalDateTime;

public class IntervalTree {

    private Node root;

    private static class Node {
        LocalDateTime start;
        LocalDateTime end;
        LocalDateTime maxEnd;
        Node left;
        Node right;

        Node(LocalDateTime start, LocalDateTime end) {
            this.start = start;
            this.end = end;
            this.maxEnd = end;
        }
    }

    // 🔹 Yeni interval ekle
    public void insert(LocalDateTime start, LocalDateTime end) {
        root = insert(root, start, end);
    }

    private Node insert(Node node, LocalDateTime start, LocalDateTime end) {
        if (node == null) {
            return new Node(start, end);
        }

        if (start.isBefore(node.start)) {
            node.left = insert(node.left, start, end);
        } else {
            node.right = insert(node.right, start, end);
        }

        // maxEnd güncelle
        if (node.maxEnd.isBefore(end)) {
            node.maxEnd = end;
        }

        return node;
    }

    // 🔴 ÇAKIŞMA VAR MI?
    public boolean hasOverlap(LocalDateTime start, LocalDateTime end) {
        return hasOverlap(root, start, end);
    }

    private boolean hasOverlap(Node node, LocalDateTime start, LocalDateTime end) {
        if (node == null) {
            return false;
        }

        // overlap kuralı
        boolean overlap =
                start.isBefore(node.end) &&
                        end.isAfter(node.start);

        if (overlap) {
            return true;
        }

        // sol subtree'de olabilir mi?
        if (node.left != null && node.left.maxEnd.isAfter(start)) {
            return hasOverlap(node.left, start, end);
        }

        // aksi halde sağ subtree
        return hasOverlap(node.right, start, end);
    }
}
