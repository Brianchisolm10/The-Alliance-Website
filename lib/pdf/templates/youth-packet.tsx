/**
 * Youth Packet PDF Template
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
import { YouthPacketContent, ExerciseData, NutritionData } from '../types';

interface YouthPacketProps {
  content: YouthPacketContent;
}

export const YouthPacketTemplate: React.FC<YouthPacketProps> = ({
  content,
}) => {
  return (
    <Document>
      <Page size="A4" style={baseStyles.page}>
        <PDFHeader
          title="Youth Wellness Packet"
          subtitle={`Age ${content.age} - ${content.developmentStage}`}
          userName={content.userName}
          date={content.generatedAt}
        />

        {/* Parent Guidance */}
        {content.parentGuidance && content.parentGuidance.length > 0 && (
          <Section title="For Parents & Guardians">
            <List items={content.parentGuidance} />
          </Section>
        )}

        {/* Goals */}
        {content.goals && content.goals.length > 0 && (
          <Section title="Wellness Goals">
            <List items={content.goals} ordered />
          </Section>
        )}

        {/* Exercises */}
        {content.exercises && content.exercises.length > 0 && (
          <Section title="Fun Movement Activities">
            {content.exercises.map((exercise, index) => (
              <ExerciseBlock key={index} exercise={exercise} />
            ))}
          </Section>
        )}

        {/* Nutrition */}
        {content.nutrition && content.nutrition.length > 0 && (
          <Section title="Healthy Eating Guide">
            {content.nutrition.map((meal, index) => (
              <NutritionBlock key={index} nutrition={meal} />
            ))}
          </Section>
        )}

        {/* Safety Guidelines */}
        {content.safetyGuidelines && content.safetyGuidelines.length > 0 && (
          <Section title="Safety First!">
            <List items={content.safetyGuidelines} />
          </Section>
        )}

        <Disclaimer
          text="DISCLAIMER: This youth wellness packet is designed for children and adolescents under adult supervision. All activities should be performed with proper supervision, appropriate equipment, and in a safe environment. Stop immediately if the child experiences pain, dizziness, or discomfort. Consult with a pediatrician before starting any new exercise or nutrition program."
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
      backgroundColor: '#fef3c7',
      borderRadius: 4,
      borderLeft: '3 solid #f59e0b',
    }}
  >
    <Text style={{ fontWeight: 'bold', fontSize: 11, marginBottom: 4 }}>
      {exercise.name}
    </Text>
    <Text style={{ fontSize: 10, marginBottom: 4 }}>
      {exercise.description}
    </Text>

    {(exercise.sets || exercise.reps || exercise.duration) && (
      <Text style={{ fontSize: 9, color: '#92400e', marginBottom: 3 }}>
        {exercise.sets && `${exercise.sets} sets`}
        {exercise.reps && ` × ${exercise.reps} reps`}
        {exercise.duration && ` | ${exercise.duration}`}
      </Text>
    )}

    {exercise.notes && (
      <View
        style={{
          marginTop: 5,
          padding: 5,
          backgroundColor: '#fffbeb',
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
          Make it easier or harder:
        </Text>
        <Text style={{ fontSize: 9 }}>{exercise.modifications.join(', ')}</Text>
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
      backgroundColor: '#dbeafe',
      borderRadius: 4,
    }}
  >
    <Text style={{ fontWeight: 'bold', fontSize: 11, marginBottom: 5 }}>
      {nutrition.mealType}
    </Text>
    {nutrition.foods.map((food, idx) => (
      <View key={idx} style={{ flexDirection: 'row', marginBottom: 2 }}>
        <Text style={{ fontSize: 10, width: 15 }}>🍽</Text>
        <Text style={{ fontSize: 10, flex: 1 }}>{food}</Text>
      </View>
    ))}
    {nutrition.notes && (
      <Text
        style={{
          fontSize: 9,
          fontStyle: 'italic',
          marginTop: 5,
          color: '#1e40af',
        }}
      >
        {nutrition.notes}
      </Text>
    )}
  </View>
);
