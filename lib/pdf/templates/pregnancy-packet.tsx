/**
 * Pregnancy Packet PDF Template
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
import { PregnancyPacketContent, ExerciseData, NutritionData } from '../types';

interface PregnancyPacketProps {
  content: PregnancyPacketContent;
}

export const PregnancyPacketTemplate: React.FC<PregnancyPacketProps> = ({
  content,
}) => {
  const trimesterName = ['First', 'Second', 'Third'][content.trimester - 1];

  return (
    <Document>
      <Page size="A4" style={baseStyles.page}>
        <PDFHeader
          title="Pregnancy Wellness Packet"
          subtitle={`${trimesterName} Trimester`}
          userName={content.userName}
          date={content.generatedAt}
        />

        {/* Trimester-Specific Guidance */}
        {content.trimesterGuidance && content.trimesterGuidance.length > 0 && (
          <Section title={`${trimesterName} Trimester Guidance`}>
            <List items={content.trimesterGuidance} />
          </Section>
        )}

        {/* Goals */}
        {content.goals && content.goals.length > 0 && (
          <Section title="Wellness Goals">
            <List items={content.goals} ordered />
          </Section>
        )}

        {/* Warning Signs */}
        {content.warningSign && content.warningSign.length > 0 && (
          <View
            style={{
              marginBottom: 15,
              padding: 12,
              backgroundColor: '#fef2f2',
              borderLeft: '4 solid #dc2626',
            }}
          >
            <Text
              style={{
                fontSize: 12,
                fontWeight: 'bold',
                color: '#991b1b',
                marginBottom: 8,
              }}
            >
              ⚠ Stop Exercise & Contact Your Healthcare Provider If:
            </Text>
            <List items={content.warningSign} />
          </View>
        )}

        {/* Contraindications */}
        {content.contraindications && content.contraindications.length > 0 && (
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
              Activities to Avoid During Pregnancy:
            </Text>
            <List items={content.contraindications} />
          </View>
        )}

        {/* Safe Exercises */}
        {content.exercises && content.exercises.length > 0 && (
          <Section title="Safe Pregnancy Exercises">
            {content.exercises.map((exercise, index) => (
              <ExerciseBlock key={index} exercise={exercise} />
            ))}
          </Section>
        )}

        {/* Nutrition */}
        {content.nutrition && content.nutrition.length > 0 && (
          <Section title="Pregnancy Nutrition">
            {content.nutrition.map((meal, index) => (
              <NutritionBlock key={index} nutrition={meal} />
            ))}
          </Section>
        )}

        <Disclaimer
          text="DISCLAIMER: This pregnancy wellness packet is for educational purposes only and does not replace prenatal care. Always consult with your obstetrician or midwife before starting or continuing any exercise program during pregnancy. Stop immediately and seek medical attention if you experience any warning signs such as vaginal bleeding, dizziness, chest pain, headache, calf pain or swelling, or decreased fetal movement."
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
      backgroundColor: '#fdf4ff',
      borderRadius: 4,
      borderLeft: '3 solid #c026d3',
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
        <Text style={{ fontSize: 9, marginRight: 10, color: '#86198f' }}>
          Sets: {exercise.sets}
        </Text>
      )}
      {exercise.reps && (
        <Text style={{ fontSize: 9, marginRight: 10, color: '#86198f' }}>
          Reps: {exercise.reps}
        </Text>
      )}
      {exercise.duration && (
        <Text style={{ fontSize: 9, marginRight: 10, color: '#86198f' }}>
          Duration: {exercise.duration}
        </Text>
      )}
      {exercise.intensity && (
        <Text style={{ fontSize: 9, color: '#86198f' }}>
          Intensity: {exercise.intensity}
        </Text>
      )}
    </View>

    {exercise.notes && (
      <View
        style={{
          marginTop: 5,
          padding: 5,
          backgroundColor: '#fae8ff',
          borderRadius: 2,
        }}
      >
        <Text style={{ fontSize: 9, fontWeight: 'bold', marginBottom: 2 }}>
          💡 Pregnancy Tip:
        </Text>
        <Text style={{ fontSize: 9 }}>{exercise.notes}</Text>
      </View>
    )}

    {exercise.modifications && exercise.modifications.length > 0 && (
      <View style={{ marginTop: 5 }}>
        <Text style={{ fontSize: 9, fontWeight: 'bold' }}>
          Trimester Modifications:
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
