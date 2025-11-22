/**
 * Assessment module registry
 * Registers all available assessment modules and provides access methods
 */

import { assessmentRegistry } from './modules/base'

// Population-specific modules
import { PregnancyModule } from './modules/pregnancy'
import { PostpartumModule } from './modules/postpartum'
import { ElderlyModule } from './modules/elderly'
import { AthleteModule } from './modules/athlete'
import { YouthModule } from './modules/youth'
import { RecoveryModule } from './modules/recovery'

// Common/lifestyle modules
import { DietaryModule } from './modules/dietary'
import { LifestyleModule } from './modules/lifestyle'
import { MovementModule } from './modules/movement'
import { EquipmentModule } from './modules/equipment'

// Register all modules
function initializeRegistry() {
  // Population-specific modules
  assessmentRegistry.register(new PregnancyModule())
  assessmentRegistry.register(new PostpartumModule())
  assessmentRegistry.register(new ElderlyModule())
  assessmentRegistry.register(new AthleteModule())
  assessmentRegistry.register(new YouthModule())
  assessmentRegistry.register(new RecoveryModule())

  // Common modules
  assessmentRegistry.register(new DietaryModule())
  assessmentRegistry.register(new LifestyleModule())
  assessmentRegistry.register(new MovementModule())
  assessmentRegistry.register(new EquipmentModule())
}

// Initialize on module load
initializeRegistry()

// Export the registry
export { assessmentRegistry }

// Export module classes for direct instantiation if needed
export {
  PregnancyModule,
  PostpartumModule,
  ElderlyModule,
  AthleteModule,
  YouthModule,
  RecoveryModule,
  DietaryModule,
  LifestyleModule,
  MovementModule,
  EquipmentModule,
}
