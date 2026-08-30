import React from "react";
import { View, StyleSheet, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeft, X } from "lucide-react-native";
import { Button, SegmentedProgress, Text } from "../../components";
import { theme } from "../../theme";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

interface SubmitProposalScreenProps {
  budget: number;
  proposedPrice: number;
  proposalDescription: string;
  onBack?: () => void;
  onContinue?: () => void;
}

export const SubmitProposalScreen: React.FC<SubmitProposalScreenProps> = ({
  budget,
  proposedPrice,
  proposalDescription,
  onBack,
  onContinue,
}) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={{ flexDirection: "row", gap: 81 }}>
          <ChevronLeft size={32} strokeWidth={1.5} onPress={onBack} />
          <SegmentedProgress currentStep={4} totalSteps={4} />
          <Pressable onPress={() => navigation.navigate("MainTabs")}>
            <X />
          </Pressable>
        </View>

        <Text variant="h1" style={styles.title}>
          Alright ready to post your proposal?
        </Text>

        <View style={styles.card1}>
          {/* item 1 */}
          <View
            style={[
              styles.carditem1,
              proposedPrice === budget && styles.singlePrice,
            ]}
          >
            <Text
              variant="bodySmallBold"
              style={proposedPrice === budget && styles.singlePriceLabel}
            >
              Business Budget
            </Text>
            <Text
              variant="bodySmallBold"
              style={[
                styles.singlePriceText,
                proposedPrice === budget && styles.singlePriceTextLarge,
              ]}
            >
              ₹{budget}
            </Text>
          </View>
          {/* item 2 & difference - only show if proposedPrice !== budget */}
          {proposedPrice !== budget && (
            <>
              {/* item 2 */}
              <View style={styles.carditem}>
                <Text variant="bodySmallBold">Your proposed price</Text>
                <Text variant="bodySmallBold">₹{proposedPrice}</Text>
              </View>
              {/* difference */}
              <View style={styles.difference}>
                <Text
                  variant="bodySmallBold"
                  style={{ color: theme.colors.primary }}
                >
                  Difference
                </Text>
                <Text
                  variant="bodySmallBold"
                  style={{ color: theme.colors.primary }}
                >
                  +₹{proposedPrice - budget}
                </Text>
              </View>
            </>
          )}
        </View>

        <Text variant="titleMd" style={styles.proposal}>
          Your proposal message
        </Text>
        <View style={styles.card}>
          <Text variant="body" style={styles.description}>
            {proposalDescription}
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        {onContinue && (
          <Button
            label="Submit Application"
            onPress={onContinue}
            fullWidth
            style={styles.continueButton}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  contentContainer: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },
  title: {
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  card1: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.lg,
    // padding: theme.spacing.md,
  },
  card: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    backgroundColor: theme.colors.surface,
  },
  carditem1: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderColor: theme.colors.border,
    marginTop: theme.spacing.md,
    marginRight: theme.spacing.md,
    marginLeft: theme.spacing.md,
    paddingBottom: theme.spacing.md,
  },
  singlePrice: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: theme.spacing.sm,
    minHeight: 80,
  },
  singlePriceLabel: {
    color: theme.colors.textSecondary,
  },
  singlePriceText: {},
  singlePriceTextLarge: {
    color: theme.colors.primary,
    fontSize: theme.fontSize["3xl"],
    fontWeight: theme.fontWeight.black,
    lineHeight: theme.lineHeight["3xl"],
  },
  difference: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
    backgroundColor: "#FAF2F9",
    borderBottomEndRadius: 12,
    borderBottomLeftRadius: 12,
  },
  carditem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: theme.spacing.md,
  },
  description: {
    marginTop: theme.spacing.sm,
    lineHeight: 22,
  },
  proposal: {
    marginTop: theme.spacing.md,
    marginBottom: 12,
  },
  footer: {
    borderTopWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.md,
    backgroundColor: theme.colors.background,
  },
  continueButton: {
    height: 52,
  },
});
