/**
 * Global teardown for NEETAI E2E tests
 * Cleans up resources after all tests are complete
 */

module.exports = async () => {
  console.log('🧹 Global teardown: Cleaning up test resources...');
  
  // Clean up any test databases, files, or external resources
  // that were created during testing
  
  console.log('✅ Global teardown completed');
};