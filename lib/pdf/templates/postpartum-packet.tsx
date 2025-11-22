/**
 * Postpartum Packet PDF Template
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
import { PostpartumPacketContent, ExerciseData, NutritionData } from '../types';

interface PostpartumPacketProps {
  content: PostpartumPacketContent;
}

export const PostpartumPacketTemplate: React.FC<PostpartumPacketProps> = ({
  content,
}) => {
  return (
    <Document>
      <Page size="A4" style={baseStyles.page}>
        <PDFHeader
          title="Postpartum Recovery Packet"
          subtitle={`${content.weeksPostpartum} Weeks Postpartum - ${content.deliveryType}`}
          userName={content.userName}
          date={content.generatedAt}
        />

        {/* Recovery Goals */}
        {content.goals && content.goals.length > 0 && (
          <Section title="Recovery Goals">
            <List items={content.goals} ordered />
          </Section>
        )}

        {/* Core Rehabilitation */}
        {content.coreRehab && content.coreRehab.length > 0 && (
          <Section title="Core & Abdominal Rehabilitation">
            <List items={content.coreRehab} />
          </Section>
        )}

        {/* Pelvic Floor Guidance */}
        {content.pelvicFloorGuidance &&
          content.pelvicFloorGuidance.length > 0 && (
            <Section title="Pelvic Floor Recovery">
              <List items={content.pelvicFloorGuidance} />
            </Section>
          )}

        {/* Return to Exercise Timeline */}
        {content.returnToExercise && content.returnToExercise.length > 0 && (
          <Section title="Return to Exercise Timeline">
            <List items={content.returnToExercise} ordered />
          </Section>
        )}

        {/* Safe Exercises */}
        {content.exercises && content.exercises.length > 0 && (
          <Section title="Safe Postpartum Exercises">
            {content.exercises.map((exercise, index) => (
              <ExerciseBlock key={index} exercise={exercise} />
            ))}
          </Section>
        )}

        {/* Nutrition for Recovery */}
        {content.nutrition && content.nutrition.length > 0 && (
          <Section title="Postpartum Nutrition">
            <Text style={{ fontSize: 10, marginBottom: 8 }}>
              Focus on nutrient-dense foods to support recovery and, if
              breastfeeding, milk production.
            </Text>
            {content.nutrition.map((meal, index) => (
              <NutritionBlock key={index} nutrition={meal} />
            ))}
          </Section>
        )}

        <Disclaimer
          text="DISCLAIMER: This postpartum recovery packet is for educational purposes only. Always get clearance from your healthcare provider before starting any exercise program after childbirth. Stop immediately if you experience pain, bleeding, or any concerning symptoms. Postpartum recovery is individual - listen to your body and progress at your own pace. Consider working with a pelvic floor physical therapist for personalized guidance."
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
    <Text style={{ fontSize: 10, marginBottom: 4, color: '#475569' }}>
      {exercise.description}
    </Text>

    <View style={{ flexDirection: 'row', marginBottom: 3 }}>
      {exercise.sets && (
        <Text style={{ fontSize: 9, marginRight: 10, color: '#92400e' }}>
          Sets: {exercise.sets}
        </Text>
      )}
      {exercise.reps && (
        <Text style={{ fontSize: 9, marginRight: 10, color: '#92400e' }}>
          Reps: {exercise.reps}
        </Text>
      )}
      {exercise.duration && (
        <Text style={{ fontSize: 9, marginRight: 10, color: '#92400e' }}>
          Duration: {exercise.duration}
        </Text>
      )}
      {exercise.intensity && (
        <Text style={{ fontSize: 9, color: '#92400e' }}>
          Intensity: {exercise.intensity}
        </Text>
      )}
    </View>

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
          💡 Recovery Tip:
        </Text>
        <Text style={{ fontSize: 9 }}>{exercise.notes}</Text>
      </View>
    )}

    {exercise.modifications && exercise.modifications.length > 0 && (
      <View style={{ marginTop: 5 }}>
        <Text style={{ fontSize: 9, fontWeight: 'bold' }}>
          Modifications:
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
          ⚠ Stop if: {exercise.contraindications.join(', ')}
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
      backgroundColor: '#fdf2f8',
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
          color: '#9f1239',
        }}
      >
        {nutrition.notes}
      </Text>
    )}
  </View>
);
