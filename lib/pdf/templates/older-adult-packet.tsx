/**
 * Older Adult Packet PDF Template
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
import { OlderAdultPacketContent, ExerciseData, NutritionData } from '../types';

interface OlderAdultPacketProps {
  content: OlderAdultPacketContent;
}

export const OlderAdultPacketTemplate: React.FC<OlderAdultPacketProps> = ({
  content,
}) => {
  return (
    <Document>
      <Page size="A4" style={baseStyles.page}>
        <PDFHeader
          title="Active Aging Wellness Packet"
          subtitle="Your Guide to Healthy, Independent Living"
          userName={content.userName}
          date={content.generatedAt}
        />

        {/* Functional Goals */}
        {content.functionalGoals && content.functionalGoals.length > 0 && (
          <Section title="Your Functional Goals">
            <List items={content.functionalGoals} ordered />
          </Section>
        )}

        {/* Safety Considerations */}
        {content.safetyConsiderations &&
          content.safetyConsiderations.length > 0 && (
            <View
              style={{
                marginBottom: 15,
                padding: 12,
                backgroundColor: '#fef3c7',
                borderLeft: '4 solid #f59e0b',
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: 'bold',
                  color: '#92400e',
                  marginBottom: 8,
                }}
              >
                Safety First:
              </Text>
              <List items={content.safetyConsiderations} />
            </View>
          )}

        {/* Fall Prevention */}
        {content.fallPrevention && content.fallPrevention.length > 0 && (
          <Section title="Fall Prevention Strategies">
            <List items={content.fallPrevention} />
          </Section>
        )}

        {/* Balance Training */}
        {content.balanceTraining && content.balanceTraining.length > 0 && (
          <Section title="Balance & Stability Training">
            <List items={content.balanceTraining} />
          </Section>
        )}

        {/* Mobility Work */}
        {content.mobilityWork && content.mobilityWork.length > 0 && (
          <Section title="Mobility & Flexibility">
            <List items={content.mobilityWork} />
          </Section>
        )}

        {/* Exercises */}
        {content.exercises && content.exercises.length > 0 && (
          <Section title="Functional Fitness Exercises">
            {content.exercises.map((exercise, index) => (
              <ExerciseBlock key={index} exercise={exercise} />
            ))}
          </Section>
        )}

        {/* Nutrition */}
        {content.nutrition && content.nutrition.length > 0 && (
          <Section title="Nutrition for Healthy Aging">
            <Text style={{ fontSize: 10, marginBottom: 8 }}>
              Focus on nutrient-dense foods to support bone health, muscle
              maintenance, and overall vitality.
            </Text>
            {content.nutrition.map((meal, index) => (
              <NutritionBlock key={index} nutrition={meal} />
            ))}
          </Section>
        )}

        <Disclaimer
          text="DISCLAIMER: This active aging wellness packet is for educational purposes only. Always consult with your healthcare provider before starting any new exercise or nutrition program, especially if you have chronic conditions, take medications, or have had recent surgeries. Stop immediately if you experience pain, dizziness, chest discomfort, or shortness of breath. Use appropriate support and supervision as needed for safety."
        />
        <PDFFooter />
      </Page>
    </Document>
  );
};

const ExerciseBlock: React.FC<{ exercise: ExerciseData }> = ({ exercise }) => (
  <View
    style={{
      marginBottom: 12,
      padding: 10,
      backgroundColor: '#eff6ff',
      borderRadius: 4,
      borderLeft: '3 solid #3b82f6',
    }}
  >
    <Text style={{ fontWeight: 'bold', fontSize: 11, marginBottom: 4 }}>
      {exercise.name}
    </Text>
    <Text style={{ fontSize: 10, marginBottom: 4, color: '#475569' }}>
      {exercise.description}
    </Text>

    <View style={{ flexDirection: 'row', marginBottom: 3 }}>
      {exercise.sets && (
        <Text style={{ fontSize: 9, marginRight: 10, color: '#1e40af' }}>
          Sets: {exercise.sets}
        </Text>
      )}
      {exercise.reps && (
        <Text style={{ fontSize: 9, marginRight: 10, color: '#1e40af' }}>
          Reps: {exercise.reps}
        </Text>
      )}
      {exercise.duration && (
        <Text style={{ fontSize: 9, marginRight: 10, color: '#1e40af' }}>
          Duration: {exercise.duration}
        </Text>
      )}
      {exercise.intensity && (
        <Text style={{ fontSize: 9, color: '#1e40af' }}>
          Intensity: {exercise.intensity}
        </Text>
      )}
    </View>

    {exercise.notes && (
      <View
        style={{
          marginTop: 5,
          padding: 5,
          backgroundColor: '#dbeafe',
          borderRadius: 2,
        }}
      >
        <Text style={{ fontSize: 9, fontWeight: 'bold', marginBottom: 2 }}>
          💡 Tip:
        </Text>
        <Text style={{ fontSize: 9 }}>{exercise.notes}</Text>
      </View>
    )}

    {exercise.modifications && exercise.modifications.length > 0 && (
      <View style={{ marginTop: 5 }}>
        <Text style={{ fontSize: 9, fontWeight: 'bold' }}>
          Easier Options:
        </Text>
        <Text style={{ fontSize: 9 }}>{exercise.modifications.join(', ')}</Text>
      </View>
    )}

    {exercise.contraindications && exercise.contraindications.length > 0 && (
      <View
        style={{
          marginTop: 5,
          padding: 5,
          backgroundColor: '#fee2e2',
          borderRadius: 2,
        }}
      >
        <Text style={{ fontSize: 8, color: '#991b1b', fontWeight: 'bold' }}>
          ⚠ Caution: {exercise.contraindications.join(', ')}
        </Text>
      </View>
    )}
  </View>
);

const NutritionBlock: React.FC<{ nutrition: NutritionData }> = ({
  nutrition,
}) => (
  <View
    style={{
      marginBottom: 12,
      padding: 10,
      backgroundColor: '#f0fdf4',
      borderRadius: 4,
    }}
  >
    <Text style={{ fontWeight: 'bold', fontSize: 11, marginBottom: 5 }}>
      {nutrition.mealType}
    </Text>
    {nutrition.foods.map((food, idx) => (
      <View key={idx} style={{ flexDirection: 'row', marginBottom: 2 }}>
        <Text style={{ fontSize: 10, width: 15 }}>•</Text>
        <Text style={{ fontSize: 10, flex: 1 }}>{food}</Text>
      </View>
    ))}
    {nutrition.macros && (
      <Text style={{ fontSize: 9, color: '#166534', marginTop: 5 }}>
        Protein: {nutrition.macros.protein}g | Carbs: {nutrition.macros.carbs}g
        | Fats: {nutrition.macros.fats}g
      </Text>
    )}
    {nutrition.notes && (
      <Text
        style={{
          fontSize: 9,
          fontStyle: 'italic',
          marginTop: 5,
          color: '#166534',
        }}
      >
        {nutrition.notes}
      </Text>
    )}
  </View>
);
