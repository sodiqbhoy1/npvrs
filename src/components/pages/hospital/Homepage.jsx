import React from 'react';
import { Heart, Shield, Users, BarChart3, Clock, MapPin, CheckCircle, ArrowRight } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';

const Homepage = () => {
  return (
    <>
      <Navbar />
      {/* Main content wrapper ensures content isn't hidden behind fixed navbar */}
      <main className="pt-20">
        {/* Hero Section */}
        <section id="home" className="relative min-h-screen flex items-center" style={{ backgroundColor: 'var(--color-background)' }}>
          <div className="absolute inset-0 opacity-5"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-10 items-center">
              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="inline-flex items-center px-3 py-1 text-sm font-medium border" style={{ color: 'var(--color-primary)', backgroundColor: 'var(--color-primary-light)', borderColor: 'var(--color-primary)', borderRadius: 'var(--radius-app)' }}>
                    <Shield className="h-4 w-4 mr-2" />
                    Digital Health Innovation
                  </div>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight" style={{ color: 'var(--color-text-primary)' }}>
                    <span style={{ color: 'var(--color-primary)' }}>NPVRS</span>: National Patient Vital Record System
                    <span className="block" style={{ color: 'var(--color-primary)' }}>Transforming Nigeria's Primary Healthcare</span>
                  </h1>
                  <p className="text-base sm:text-lg leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                    Instant access to vital health records across all PHCs and hospitals. Reducing emergency response time, preventing avoidable deaths, and strengthening national health data systems.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-4 sm:gap-6 pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold" style={{ color: 'var(--color-primary)' }}>70%</div>
                    <div className="text-sm" style={{ color: 'var(--color-text-muted)' }}>PHC Usage Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold" style={{ color: 'var(--color-primary)' }}>6mo</div>
                    <div className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Pilot Roadmap</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold" style={{ color: 'var(--color-primary)' }}>24/7</div>
                    <div className="text-sm" style={{ color: 'var(--color-text-muted)' }}>System Access</div>
                  </div>
                </div>
              </div>
              
              <div className="relative md:-mt-8 lg:-mt-12">
                <div className="p-6 sm:p-8 max-w-md md:max-w-none mx-auto" style={{ backgroundColor: 'var(--color-background)', borderRadius: 'var(--radius-app)' }}>
                  <div className="p-5 sm:p-6 border" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)', borderRadius: 'var(--radius-app)' }}>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 flex items-center justify-center" style={{ backgroundColor: 'var(--color-primary)', borderRadius: 'var(--radius-app)' }}>
                          <Heart className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>Patient Profile</h3>
                          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Instant Health Access</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3" style={{ backgroundColor: 'var(--color-primary-light)', borderRadius: 'var(--radius-app)' }}>
                          <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Blood Pressure</div>
                          <div className="font-semibold" style={{ color: 'var(--color-primary)' }}>120/80</div>
                        </div>
                        <div className="p-3" style={{ backgroundColor: 'var(--color-primary-light)', borderRadius: 'var(--radius-app)' }}>
                          <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Heart Rate</div>
                          <div className="font-semibold" style={{ color: 'var(--color-primary)' }}>72 BPM</div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center text-sm">
                          <CheckCircle className="h-4 w-4 mr-2" style={{ color: 'var(--color-success)' }} />
                          <span style={{ color: 'var(--color-text-secondary)' }}>Allergies: None recorded</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <CheckCircle className="h-4 w-4 mr-2" style={{ color: 'var(--color-success)' }} />
                          <span style={{ color: 'var(--color-text-secondary)' }}>Last visit: Lagos PHC</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Problem Section */}
        <section className="py-16 sm:py-20" style={{ backgroundColor: 'var(--color-background)' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>The Critical Challenge</h2>
              <p className="text-xl max-w-3xl mx-auto" style={{ color: 'var(--color-text-secondary)' }}>
                Nigeria's healthcare system faces urgent challenges that cost lives and resources daily
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="p-6 border" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)', borderRadius: 'var(--radius-app)' }}>
                <div className="w-12 h-12 flex items-center justify-center mb-4" style={{ backgroundColor: '#FEE2E2', borderRadius: 'var(--radius-app)' }}>
                  <Clock className="h-6 w-6" style={{ color: 'var(--color-danger)' }} />
                </div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>Long Waiting Times</h3>
                <p style={{ color: 'var(--color-text-secondary)' }}>Emergency patients wait as vital signs and histories are re-captured at each facility</p>
              </div>
              
              <div className="p-6 border" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)', borderRadius: 'var(--radius-app)' }}>
                <div className="w-12 h-12 flex items-center justify-center mb-4" style={{ backgroundColor: '#FEF3C7', borderRadius: 'var(--radius-app)' }}>
                  <MapPin className="h-6 w-6" style={{ color: 'var(--color-warning)' }} />
                </div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>Fragmented Records</h3>
                <p style={{ color: 'var(--color-text-secondary)' }}>Patients move across facilities with no unified health background accessible</p>
              </div>
              
              <div className="p-6 border" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)', borderRadius: 'var(--radius-app)' }}>
                <div className="w-12 h-12 flex items-center justify-center mb-4" style={{ backgroundColor: '#FEE2E2', borderRadius: 'var(--radius-app)' }}>
                  <Heart className="h-6 w-6" style={{ color: 'var(--color-danger)' }} />
                </div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>Emergency Deaths</h3>
                <p style={{ color: 'var(--color-text-secondary)' }}>Lack of instant data leads to avoidable loss of life in maternal care and trauma</p>
              </div>
              
              <div className="p-6 border" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)', borderRadius: 'var(--radius-app)' }}>
                <div className="w-12 h-12 flex items-center justify-center mb-4" style={{ backgroundColor: '#FEF3C7', borderRadius: 'var(--radius-app)' }}>
                  <BarChart3 className="h-6 w-6" style={{ color: 'var(--color-warning)' }} />
                </div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>Weak Reporting</h3>
                <p style={{ color: 'var(--color-text-secondary)' }}>PHC system struggles with timely, accurate data for planning and donor reporting</p>
              </div>
            </div>
          </div>
        </section>

        {/* Solution Section */}
        <section id="features" className="py-16 sm:py-20" style={{ backgroundColor: 'var(--color-surface)' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>
                <span style={{ color: 'var(--color-primary)' }}>Our Solution:</span> PHC E-Health Platform
              </h2>
              <p className="text-xl max-w-3xl mx-auto" style={{ color: 'var(--color-text-secondary)' }}>
                A comprehensive digital health backbone that connects every PHC and hospital across Nigeria
              </p>
            </div>
            
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="space-y-8">
                <div className="p-6 border" style={{ backgroundColor: 'var(--color-primary-light)', borderColor: 'var(--color-primary)', borderRadius: 'var(--radius-app)' }}>
                  <div className="w-12 h-12 flex items-center justify-center mb-4" style={{ backgroundColor: 'var(--color-primary)', borderRadius: 'var(--radius-app)' }}>
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>Unified Vital Records</h3>
                  <p style={{ color: 'var(--color-text-secondary)' }}>Every patient gets a portable digital health profile accessible in any participating PHC or hospital</p>
                </div>
                
                <div className="p-6 border" style={{ backgroundColor: 'var(--color-primary-light)', borderColor: 'var(--color-primary)', borderRadius: 'var(--radius-app)' }}>
                  <div className="w-12 h-12 flex items-center justify-center mb-4" style={{ backgroundColor: 'var(--color-primary)', borderRadius: 'var(--radius-app)' }}>
                    <Heart className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>Emergency-Ready</h3>
                  <p style={{ color: 'var(--color-text-secondary)' }}>Doctors can view patient vitals, allergies, chronic conditions, and medication history instantly</p>
                </div>
              </div>
              
              <div className="lg:col-span-2 space-y-8">
                <div className="p-8 text-white" style={{ backgroundColor: 'var(--color-primary)', borderRadius: 'var(--radius-app)' }}>
                  <h3 className="text-2xl font-bold mb-4">Technical Excellence</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2">Interoperable Design</h4>
                      <p style={{ color: '#B2D8D8' }}>Built with FHIR standards, ensuring future integration with DHIS2, NHIA, and donor systems</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Cloud & Offline Support</h4>
                      <p style={{ color: '#B2D8D8' }}>Works seamlessly in low-bandwidth, rural environments across Nigeria</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-6 border" style={{ backgroundColor: '#F3E8FF', borderColor: '#9333EA', borderRadius: 'var(--radius-app)' }}>
                  <div className="w-12 h-12 flex items-center justify-center mb-4" style={{ backgroundColor: '#9333EA', borderRadius: 'var(--radius-app)' }}>
                    <BarChart3 className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>Analytics Dashboard</h3>
                  <p style={{ color: 'var(--color-text-secondary)' }}>Generates real-time insights for PHC managers, states, and federal health authorities</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 sm:py-20" style={{ backgroundColor: 'var(--color-primary)' }}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold text-white mb-4">Ready to Transform Healthcare?</h2>
            <p className="text-xl mb-8" style={{ color: '#B2D8D8' }}>
              Join the digital health revolution that's saving lives across Nigeria
            </p>
          </div>
        </section>
      </main>
      {/* Footer */}
      <Footer />
    </>
  );
};

export default Homepage;