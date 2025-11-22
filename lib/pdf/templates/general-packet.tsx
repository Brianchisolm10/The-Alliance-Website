/**
 * General Packet PDF Template
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
import { GeneralPacketContent, ExerciseData, NutritionData } from '../types';

interface GeneralPacketProps {
  content: GeneralPacketContent;
}

export const GeneralPacketTemplate: React.FC<GeneralPacketProps> = ({
  content,
}) => {
  return (
    <Document>
      <Page size="A4" style={baseStyles.page}>
        <PDFHeader
          title="General Wellness Packet"
          subtitle="Your Personalized Wellness Guide"
          userName={content.userName}
          date={content.generatedAt}
        />

        {/* Introduction */}
        <Section title="Welcome to Your Wellness Journey">
          <Text>{content.introduction}</Text>
        </Section>

        {/* Goals */}
        {content.goals && content.goals.length > 0 && (
          <Section title="Your Wellness Goals">
            <List items={content.goals} />
          </Section>
        )}

        {/* Recommendations */}
        {content.recommendations && content.recommendations.length > 0 && (
          <Section title="Key Recommendations">
            <List items={content.recommendations} ordered />
          </Section>
        )}

        {/* Lifestyle Guidance */}
        {content.lifestyle && (
          <Section title="Lifestyle Guidance">
            {content.lifestyle.sleep && (
              <View style={{ marginBottom: 10 }}>
                <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>
                  Sleep:
                </Text>
                <Text>{content.lifestyle.sleep}</Text>
              </View>
            )}
            {content.lifestyle.hydration && (
              <View style={{ marginBottom: 10 }}>
                <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>
                  Hydration:
                </Text>
                <Text>{content.lifestyle.hydration}</Text>
              </View>
            )}
            {content.lifestyle.stress && (
              <View style={{ marginBottom: 10 }}>
                <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>
                  Stress Management:
                </Text>
                <Text>{content.lifestyle.stress}</Text>
              </View>
            )}
          </Section>
        )}

        {/* Exercises */}
        {content.exercises && content.exercises.length > 0 && (
          <Section title="Recommended Exercises">
            {content.exercises.map((exercise, index) => (
              <ExerciseBlock key={index} exercise={exercise} />
            ))}
          </Section>
        )}

        {/* Nutrition */}
        {content.nutrition && content.nutrition.length > 0 && (
          <Section title="Nutrition Guidance">
            {content.nutrition.map((meal, index) => (
              <NutritionBlock key={index} nutrition={meal} />
            ))}
          </Section>
        )}

        <Disclaimer />
        <PDFFooter />
      </Page>
    </Document>
  );
};

const ExerciseBlock: React.FC<{ exercise: ExerciseData }> = ({ exercise }) => (
  <View style={{ marginBottom: 15, paddingBottom: 10, borderBottom: '1 solid #e2e8f0' }}>
    <Text style={{ fontWeight: 'bold', fontSize: 12, marginBottom: 5 }}>
      {exercise.name}
    </Text>
    <Text style={{ fontSize: 10, marginBottom: 5 }}>{exercise.description}</Text>
    {(exercise.sets || exercise.reps || exercise.duration) && (
      <Text style={{ fontSize: 10, color: '#64748b', marginBottom: 3 }}>
        {exercise.sets && `${exercise.sets} sets`}
        {exercise.reps && ` × ${exercise.reps} reps`}
        {exercise.duration && ` | ${exercise.duration}`}
      </Text>
    )}
    {exercise.notes && (
      <Text style={{ fontSize: 9, fontStyle: 'italic', marginTop: 3 }}>
        Note: {exercise.notes}
      </Text>
    )}
  </View>
);

const NutritionBlock: React.FC<{ nutrition: NutritionData }> = ({
  nutrition,
}) => (
  <View style={{ marginBottom: 15, paddingBottom: 10, borderBottom: '1 solid #e2e8f0' }}>
    <Text style={{ fontWeight: 'bold', fontSize: 12, marginBottom: 5 }}>
      {nutrition.mealType}
    </Text>
    <List items={nutrition.foods} />
    {nutrition.macros && (
      <Text style={{ fontSize: 9, color: '#64748b', marginTop: 5 }}>
        Macros: {nutrition.macros.protein}g protein | {nutrition.macros.carbs}g
        carbs | {nutrition.macros.fats}g fats
        {nutrition.calories && ` | ${nutrition.calories} calories`}
      </Text>
    )}
    {nutrition.notes && (
      <Text style={{ fontSize: 9, fontStyle: 'italic', marginTop: 3 }}>
        {nutrition.notes}
      </Text>
    )}
  </View>
);
