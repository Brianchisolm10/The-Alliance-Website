/**
 * Athlete Performance Packet PDF Template
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
import { AthletePacketContent, ExerciseData, NutritionData } from '../types';

interface AthletePacketProps {
  content: AthletePacketContent;
}

export const AthletePacketTemplate: React.FC<AthletePacketProps> = ({
  content,
}) => {
  return (
    <Document>
      <Page size="A4" style={baseStyles.page}>
        <PDFHeader
          title="Athlete Performance Packet"
          subtitle={`${content.sport}${content.position ? ` - ${content.position}` : ''}`}
          userName={content.userName}
          date={content.generatedAt}
        />

        {/* Performance Goals */}
        {content.performanceGoals && content.performanceGoals.length > 0 && (
          <Section title="Performance Goals">
            <List items={content.performanceGoals} ordered />
          </Section>
        )}

        {/* Strength Program */}
        {content.strengthProgram && content.strengthProgram.length > 0 && (
          <Section title="Strength & Power Program">
            {content.strengthProgram.map((exercise, index) => (
              <ExerciseBlock key={index} exercise={exercise} />
            ))}
          </Section>
        )}

        {/* Conditioning Program */}
        {content.conditioningProgram && content.conditioningProgram.length > 0 && (
          <Section title="Conditioning & Endurance">
            {content.conditioningProgram.map((exercise, index) => (
              <ExerciseBlock key={index} exercise={exercise} />
            ))}
          </Section>
        )}

        {/* Recovery Protocol */}
        {content.recoveryProtocol && content.recoveryProtocol.length > 0 && (
          <Section title="Recovery Protocol">
            <List items={content.recoveryProtocol} />
          </Section>
        )}

        {/* Nutrition Strategy */}
        {content.nutritionStrategy && content.nutritionStrategy.length > 0 && (
          <Section title="Performance Nutrition">
            {content.nutritionStrategy.map((meal, index) => (
              <NutritionBlock key={index} nutrition={meal} />
            ))}
          </Section>
        )}

        <Disclaimer
          text="DISCLAIMER: This performance packet is designed for athletes and should be used under the guidance of qualified coaches and healthcare professionals. Stop immediately if you experience pain, dizziness, or unusual symptoms. Proper warm-up, technique, and recovery are essential for injury prevention and optimal performance."
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
      paddingBottom: 10,
      borderBottom: '1 solid #e2e8f0',
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
        <Text style={{ fontSize: 9, marginRight: 10, color: '#64748b' }}>
          Sets: {exercise.sets}
        </Text>
      )}
      {exercise.reps && (
        <Text style={{ fontSize: 9, marginRight: 10, color: '#64748b' }}>
          Reps: {exercise.reps}
        </Text>
      )}
      {exercise.duration && (
        <Text style={{ fontSize: 9, marginRight: 10, color: '#64748b' }}>
          Duration: {exercise.duration}
        </Text>
      )}
      {exercise.intensity && (
        <Text style={{ fontSize: 9, color: '#64748b' }}>
          Intensity: {exercise.intensity}
        </Text>
      )}
    </View>

    {exercise.notes && (
      <Text
        style={{
          fontSize: 9,
          fontStyle: 'italic',
          marginTop: 4,
          color: '#64748b',
        }}
      >
        {exercise.notes}
      </Text>
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
      backgroundColor: '#f8fafc',
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
      <Text style={{ fontSize: 9, color: '#64748b', marginTop: 5 }}>
        P: {nutrition.macros.protein}g | C: {nutrition.macros.carbs}g | F:{' '}
        {nutrition.macros.fats}g
        {nutrition.calories && ` | ${nutrition.calories} cal`}
      </Text>
    )}
  </View>
);
