// app/screens/member/ProfileScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Platform,
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { auth, db } from "../../config/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";

export default function ProfileScreen({ navigation }) {
  const [membre, setMembre] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          navigation.replace("Login");
          return;
        }

        const membreRef = doc(db, "membres", user.uid);
        const membreSnap = await getDoc(membreRef);

        if (membreSnap.exists()) {
          setMembre(membreSnap.data());
        }
      } catch (error) {
        console.error("Erreur chargement profil:", error);
        Alert.alert("Erreur", "Impossible de charger le profil");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleLogout = () => {
    Alert.alert("تسجيل الخروج", "هل أنت متأكد من تسجيل الخروج؟", [
      { text: "إلغاء", style: "cancel" },
      {
        text: "تسجيل الخروج",
        style: "destructive",
        onPress: async () => {
          try {
            await signOut(auth);
            navigation.replace("Login");
          } catch (error) {
            Alert.alert("خطأ", "حدث خطأ أثناء تسجيل الخروج");
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>جاري التحميل...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* En-tête avec photo et nom */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>رجوع</Text>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>

          <View style={styles.profileHeader}>
            <View style={styles.avatarLargeContainer}>
              {membre?.avatar ? (
                <Image
                  source={{ uri: membre.avatar }}
                  style={styles.avatarLarge}
                />
              ) : (
                <View style={styles.avatarLargePlaceholder}>
                  <Text style={styles.avatarLargeText}>
                    {membre?.prenom?.[0] || "أ"}
                    {membre?.nom?.[0] || "ب"}
                  </Text>
                </View>
              )}
            </View>

            <Text style={styles.userFullName}>
              {membre?.prenom || "أمينة"} {membre?.nom || "بنعلي"}
            </Text>
            <View style={styles.roleBadge}>
              <Text style={styles.roleText}>عضو</Text>
            </View>
          </View>
        </View>

        {/* Section: المعلومات الشخصية */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>المعلومات الشخصية</Text>
            <Text style={styles.sectionSubtitle}>معلومات ملفك الشخصي</Text>
          </View>

          <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>الاسم الكامل</Text>
              <Text style={styles.infoValue}>
                {membre?.prenom || "أمينة"} {membre?.nom || "بنعلي"}
              </Text>
            </View>

            <View style={styles.infoDivider} />

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>تاريخ الميلاد</Text>
              <Text style={styles.infoValue}>
                {membre?.dateNaissance || "15 مارس 1995"}
              </Text>
            </View>

            <View style={styles.infoDivider} />

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>الجنس</Text>
              <Text style={styles.infoValue}>
                {membre?.genre === "feminin"
                  ? "أنثى"
                  : membre?.genre === "masculin"
                    ? "ذكر"
                    : "أنثى"}
              </Text>
            </View>
          </View>
        </View>

        {/* Section: الحساب */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>الحساب</Text>
            <Text style={styles.sectionSubtitle}>إدارة حسابك</Text>
          </View>

          <View style={styles.menuContainer}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigation.navigate("EditProfile")}
            >
              <View style={styles.menuItemLeft}>
                <Text style={styles.menuIcon}>✏️</Text>
                <Text style={styles.menuText}>تعديل الملف الشخصي</Text>
              </View>
              <Text style={styles.menuArrow}>←</Text>
            </TouchableOpacity>

            <View style={styles.menuDivider} />

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigation.navigate("ChangePassword")}
            >
              <View style={styles.menuItemLeft}>
                <Text style={styles.menuIcon}>🔒</Text>
                <Text style={styles.menuText}>تغيير كلمة المرور</Text>
              </View>
              <Text style={styles.menuArrow}>←</Text>
            </TouchableOpacity>

            <View style={styles.menuDivider} />

            <TouchableOpacity
              style={[styles.menuItem, styles.logoutItem]}
              onPress={handleLogout}
            >
              <View style={styles.menuItemLeft}>
                <Text style={[styles.menuIcon, styles.logoutIcon]}>🚪</Text>
                <Text style={[styles.menuText, styles.logoutText]}>
                  تسجيل الخروج
                </Text>
              </View>
              <Text style={styles.menuArrow}>←</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Version de l'application */}
        <Text style={styles.versionText}>الإصدار 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 30,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#6B7280",
  },
  // Header
  header: {
    backgroundColor: "#16A34A",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 20 : 40,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-end",
    marginBottom: 10,
  },
  backButtonText: {
    color: "white",
    fontSize: 16,
    marginRight: 5,
    writingDirection: "rtl",
  },
  backIcon: {
    color: "white",
    fontSize: 18,
  },
  profileHeader: {
    alignItems: "center",
  },
  avatarLargeContainer: {
    marginBottom: 16,
  },
  avatarLarge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: "white",
  },
  avatarLargePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#EAB308",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "white",
  },
  avatarLargeText: {
    fontSize: 40,
    fontWeight: "bold",
    color: "white",
  },
  userFullName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 8,
    writingDirection: "rtl",
  },
  roleBadge: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  roleText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  // Section Card
  sectionCard: {
    backgroundColor: "white",
    borderRadius: 20,
    marginHorizontal: 20,
    marginTop: 24,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionHeader: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2937",
    writingDirection: "rtl",
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    writingDirection: "rtl",
  },
  // Info Section
  infoContainer: {
    marginTop: 8,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  infoLabel: {
    fontSize: 15,
    color: "#6B7280",
    writingDirection: "rtl",
  },
  infoValue: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1F2937",
    writingDirection: "rtl",
  },
  infoDivider: {
    height: 1,
    backgroundColor: "#F3F4F6",
  },
  // Menu Section
  menuContainer: {
    marginTop: 8,
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  menuText: {
    fontSize: 16,
    color: "#374151",
    writingDirection: "rtl",
  },
  menuArrow: {
    fontSize: 18,
    color: "#9CA3AF",
  },
  menuDivider: {
    height: 1,
    backgroundColor: "#F3F4F6",
  },
  logoutItem: {
    marginTop: 0,
  },
  logoutIcon: {
    color: "#EF4444",
  },
  logoutText: {
    color: "#EF4444",
    fontWeight: "500",
  },
  versionText: {
    textAlign: "center",
    color: "#9CA3AF",
    fontSize: 12,
    marginTop: 30,
  },
});
