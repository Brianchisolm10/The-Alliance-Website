/**
 * Nutrition Packet PDF Template
 */

import React from 'react';
import { Document, Page, Text, View } from '@react-pdf/renderer';
import {
  PDFHeader,
  PDFFooter,
  Section,
  List,
  Disclaimer,
  baseStyles,
} from '../components/base';
import { NutritionPacketContent, NutritionData } from '../types';

interface NutritionPacketProps {
  content: NutritionPacketContent;
}

export const NutritionPacketTemplate: React.FC<NutritionPacketProps> = ({
  content,
}) => {
  return (
    <Document>
      <Page size="A4" style={baseStyles.page}>
        <PDFHeader
          title="Nutrition Packet"
          subtitle="Your Personalized Nutrition Plan"
          userName={content.userName}
          date={content.generatedAt}
        />

        {/* Nutrition Goals */}
        {content.nutritionGoals && content.nutritionGoals.length > 0 && (
          <Section title="Your Nutrition Goals">
            <List items={content.nutritionGoals} ordered />
          </Section>
        )}

        {/* Dietary Restrictions */}
        {content.restrictions && content.restrictions.length > 0 && (
          <Section title="Dietary Considerations">
            <List items={content.restrictions} />
          </Section>
        )}

        {/* Meal Plan */}
        {content.mealPlan && content.mealPlan.length > 0 && (
          <Section title="Your Meal Plan">
            {content.mealPlan.map((meal, index) => (
              <MealBlock key={index} nutrition={meal} />
            ))}
          </Section>
        )}

        {/* Guidelines */}
        {content.guidelines && content.guidelines.length > 0 && (
          <Section title="Nutrition Guidelines">
            <List items={content.guidelines} ordered />
          </Section>
        )}

        {/* Supplements */}
        {content.supplements && content.supplements.length > 0 && (
          <Section title="Recommended Supplements">
            <List items={content.supplements} />
            <Text style={{ fontSize: 9, marginTop: 10, fontStyle: 'italic' }}>
              Note: Always consult with a healthcare provider before starting any
              supplement regimen.
            </Text>
          </Section>
        )}

        <Disclaimer />
        <PDFFooter />
      </Page>
    </Document>
  );
};

const MealBlock: React.FC<{ nutrition: NutritionData }> = ({ nutrition }) => (
  <View
    style={{
      marginBottom: 15,
      padding: 10,
      backgroundColor: '#f8fafc',
      borderRadius: 4,
    }}
  >
    <Text style={{ fontWeight: 'bold', fontSize: 12, marginBottom: 8 }}>
      {nutrition.mealType}
    </Text>

    <View style={{ marginBottom: 5 }}>
      <Text style={{ fontSize: 10, fontWeight: 'bold', marginBottom: 3 }}>
        Foods:
      </Text>
      {nutrition.foods.map((food, idx) => (
        <View key={idx} style={{ flexDirection: 'row', marginBottom: 2 }}>
          <Text style={{ fontSize: 10, width: 15 }}>•</Text>
          <Text style={{ fontSize: 10, flex: 1 }}>
            {food}
            {nutrition.portions && nutrition.portions[idx]
              ? ` - ${nutrition.portions[idx]}`
              : ''}
          </Text>
        </View>
      ))}
    </View>

    {nutrition.macros && (
      <View
        style={{
          marginTop: 8,
          padding: 8,
          backgroundColor: '#ffffff',
          borderRadius: 4,
        }}
      >
        <Text style={{ fontSize: 9, fontWeight: 'bold', marginBottom: 3 }}>
          Nutritional Information:
        </Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ fontSize: 9 }}>
            Protein: {nutrition.macros.protein}g
          </Text>
          <Text style={{ fontSize: 9 }}>Carbs: {nutrition.macros.carbs}g</Text>
          <Text style={{ fontSize: 9 }}>Fats: {nutrition.macros.fats}g</Text>
          {nutrition.calories && (
            <Text style={{ fontSize: 9 }}>
              Calories: {nutrition.calories}
            </Text>
          )}
        </View>
      </View>
    )}

    {nutrition.notes && (
      <Text
        style={{
          fontSize: 9,
          fontStyle: 'italic',
          marginTop: 5,
          color: '#64748b',
        }}
      >
        {nutrition.notes}
      </Text>
    )}

    {nutrition.alternatives && nutrition.alternatives.length > 0 && (
      <View style={{ marginTop: 5 }}>
        <Text style={{ fontSize: 9, fontWeight: 'bold' }}>Alternatives:</Text>
        <Text style={{ fontSize: 9 }}>{nutrition.alternatives.join(', ')}</Text>
      </View>
    )}
  </View>
);
