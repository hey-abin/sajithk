import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import { ChevronDown, Camera, Video, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import MagneticButton from './MagneticButton';
import img1 from '../../imports/IMG_4770.JPG';
import img2 from '../../imports/IMG_4886.PNG';

export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const y2 = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

  return (
    <div ref={containerRef} className="min-h-screen">
      {/* Hero Section with Parallax */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background Elements */}
        <motion.div
          style={{ y: y1 }}
          className="absolute inset-0 z-0"
        >
          <div className="absolute top-20 left-10 w-72 h-72 bg-sky-blue/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-sky-blue/10 rounded-full blur-3xl" />
        </motion.div>

        {/* 3D Floating Elements */}
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotateZ: [0, 5, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-1/4 right-1/4 hidden lg:block"
        >
          <div className="w-24 h-24 bg-gradient-to-br from-sky-blue/30 to-sky-blue/10 rounded-2xl backdrop-blur-sm border border-sky-blue/20 shadow-2xl" />
        </motion.div>

        <motion.div
          animate={{
            y: [0, 15, 0],
            rotateZ: [0, -5, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1,
          }}
          className="absolute bottom-1/3 left-1/4 hidden lg:block"
        >
          <div className="w-32 h-32 bg-gradient-to-br from-white to-sky-blue/20 rounded-3xl backdrop-blur-sm border border-sky-blue/20 shadow-2xl" />
        </motion.div>

        {/* Hero Content */}
        <motion.div
          style={{ opacity, scale }}
          className="relative z-10 text-center px-4 max-w-5xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-6"
          >
            <Sparkles className="w-12 h-12 mx-auto mb-4 text-sky-blue" />
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-4">
              Visual Storyteller
            </h1>
            <p className="text-xl sm:text-2xl text-black/70 max-w-2xl mx-auto">
              Creating captivating videos, stunning photography, and bringing ideas to life through creative editing
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-wrap gap-4 justify-center mb-12"
          >
            {[
              { icon: Video, text: 'Videography' },
              { icon: Camera, text: 'Photography' },
              { icon: Sparkles, text: 'Editing' },
            ].map((skill, i) => (
              <motion.div
                key={skill.text}
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 px-6 py-3 bg-white/50 backdrop-blur-sm rounded-full border border-sky-blue/20 shadow-lg"
              >
                <skill.icon className="w-5 h-5 text-sky-blue" />
                <span>{skill.text}</span>
              </motion.div>
            ))}
          </motion.div>

          <Link to="/projects">
            <MagneticButton className="px-8 py-4 bg-sky-blue text-white rounded-full font-medium shadow-xl hover:shadow-2xl transition-shadow">
              View Projects
            </MagneticButton>
          </Link>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
        >
          <ChevronDown className="w-8 h-8 text-sky-blue" />
        </motion.div>
      </section>

      {/* About Section with Parallax */}
      <section className="relative py-32 px-4 overflow-hidden">
        <motion.div style={{ y: y2 }} className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl font-bold mb-6">
                Crafting Visual Experiences
              </h2>
              <p className="text-lg text-black/70 mb-6">
                As a multidisciplinary creator, I specialize in capturing moments and transforming them into compelling visual narratives. From cinematography to post-production, every project is crafted with precision and creativity.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-sky-blue rounded-full mt-2" />
                  <div>
                    <h3 className="font-semibold mb-1">Professional Tools</h3>
                    <p className="text-black/60">Photoshop, Lightroom, After Effects, CapCut</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-sky-blue rounded-full mt-2" />
                  <div>
                    <h3 className="font-semibold mb-1">Creative Vision</h3>
                    <p className="text-black/60">Bringing unique perspectives to every project</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="grid grid-cols-2 gap-4">
                <motion.div
                  whileHover={{ scale: 1.05, rotateZ: 2 }}
                  className="aspect-square rounded-2xl overflow-hidden shadow-2xl"
                >
                  <img
                    src={img1}
                    alt="Photography work"
                    className="w-full h-full object-cover"
                  />
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05, rotateZ: -2 }}
                  className="aspect-square rounded-2xl overflow-hidden shadow-2xl mt-8"
                >
                  <img
                    src={img2}
                    alt="Video work"
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              </div>
              <div className="absolute -z-10 inset-0 bg-sky-blue/10 blur-3xl" />
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Skills Section */}
      <section className="py-32 px-4 bg-gradient-to-b from-white to-sky-blue/5">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center mb-16"
          >
            What I Do
          </motion.h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Videography', desc: 'Cinematic storytelling through motion', icon: '🎬' },
              { title: 'Photography', desc: 'Capturing moments in time', icon: '📸' },
              { title: 'Editing', desc: 'Post-production perfection', icon: '✨' },
              { title: 'Motion Graphics', desc: 'Dynamic visual effects', icon: '🎨' },
            ].map((skill, i) => (
              <motion.div
                key={skill.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -10 }}
                className="p-8 bg-white rounded-2xl shadow-lg border border-sky-blue/10"
              >
                <div className="text-4xl mb-4">{skill.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{skill.title}</h3>
                <p className="text-black/60">{skill.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center bg-gradient-to-br from-sky-blue to-sky-blue/80 rounded-3xl p-12 shadow-2xl"
        >
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Create Something Amazing?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Let's bring your vision to life with stunning visuals
          </p>
          <Link to="/projects">
            <MagneticButton className="px-8 py-4 bg-white text-sky-blue rounded-full font-medium shadow-xl hover:shadow-2xl transition-shadow">
              Explore My Work
            </MagneticButton>
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
