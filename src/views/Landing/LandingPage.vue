<template>
  <div class="min-h-screen bg-white dark:bg-gray-900">
    <LandingHeader />
    <main>
      <LandingHero />
      <LandingTrust />
      <LandingInvestmentOpportunities />
      <LandingHowItWorks />
      <LandingBenefits />
      <LandingAlquilerCta />
    </main>
    <LandingFooter />
  </div>
</template>

<script setup lang="ts">
import LandingHeader from '@/components/landing/LandingHeader.vue'
import LandingHero from '@/components/landing/LandingHero.vue'
import LandingHowItWorks from '@/components/landing/LandingHowItWorks.vue'
import LandingBenefits from '@/components/landing/LandingBenefits.vue'
import LandingAlquilerCta from '@/components/landing/LandingAlquilerCta.vue'
import LandingTrust from '@/components/landing/LandingTrust.vue'
import LandingInvestmentOpportunities from '@/components/landing/LandingInvestmentOpportunities.vue'
import LandingFooter from '@/components/landing/LandingFooter.vue'
</script>
