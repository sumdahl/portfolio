import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, GraduationCap, Briefcase, FileText, Calendar } from 'lucide-react';
import Link from 'next/link';
import { TechStack } from '@/components/about/TechStack';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto space-y-16">

        {/* Intro Section */}
        <section className="space-y-6 relative">
          <div className="absolute inset-0 bg-primary/5 blur-3xl -z-10 rounded-full opacity-50" />
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent animate-fade-in">
            About Me
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl">
            I&apos;m a Full-Stack Software Engineer passionate about building modern, scalable, and user-friendly web applications. Experienced in both frontend and backend development, I create end-to-end solutions that solve real-world problems while writing clean, maintainable code.
          </p>
          <div className="flex gap-4">
            <Button className="rounded-full shadow-lg hover:shadow-primary/25 transition-all duration-300" asChild>
              <Link href="/contact">Let&apos;s Connect</Link>
            </Button>
          </div>
        </section>

        <div className="space-y-16">
          {/* Tech Stack */}
          <TechStack />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Experience Section */}
            <section className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <Briefcase className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-3xl font-bold">Experience</h2>
              </div>

              <Card className="border-border/50 bg-card/40 backdrop-blur-md hover:bg-card/60 hover:border-primary/50 transition-all duration-300 group shadow-sm hover:shadow-xl hover:-translate-y-1">
                <CardHeader>
                  <div className="flex justify-between items-start w-full">
                    <div className="space-y-1 flex-1">
                      <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">
                        Full Stack Developer Internship
                      </CardTitle>
                      <div className="flex items-center gap-3 mt-1">
                        <CardDescription className="text-base font-medium text-foreground">
                          <a
                            href="https://lexflow.fr"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline inline-flex items-center gap-1"
                          >
                            Lexflow <ExternalLink className="w-3 h-3" />
                          </a>
                        </CardDescription>

                        {/* Internship Letter Button */}
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2 ml-auto"
                          asChild
                        >
                          <a
                            href="/internship-letter.png"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <FileText className="w-4 h-4" />
                            View
                          </a>
                        </Button>
                      </div>
                    </div>
                    <Badge variant="secondary" className="font-mono text-xs ml-4">
                      2025
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground font-mono">
                    <Calendar className="w-4 h-4" />
                    <span>Jun 2025 - Sep 2025</span>
                  </div>
                  <p className="text-muted-foreground">
                    Developed hands-on experience in contemporary web development, backend programming, and workflow automation. Built scalable interfaces with React and Next.js, and robust backend services with Python Flask.
                  </p>
                </CardContent>
              </Card>
            </section>

            {/* Education Section */}
            <section className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <GraduationCap className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-3xl font-bold">Education</h2>
              </div>

              <Card className="border-border/50 bg-card/40 backdrop-blur-md hover:bg-card/60 hover:border-primary/50 transition-all duration-300 group shadow-sm hover:shadow-xl hover:-translate-y-1">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <CardTitle className="text-xl font-bold">Bachelor of Information Technology</CardTitle>
                      <CardDescription className="text-base">Amrit Campus, Tribhuvan University</CardDescription>
                    </div>
                    <Badge variant="outline" className="font-mono text-xs">
                      Running
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground font-mono mb-4">
                    <Calendar className="w-4 h-4" />
                    <span>Mar 2022 - Present</span>
                  </div>
                  <p className="text-muted-foreground">
                    Focused on software engineering fundamentals, data structures, algorithms, and modern web technologies, strengthening core computer science principles overall.
                  </p>
                </CardContent>
              </Card>
            </section>
          </div>

        </div>
      </div>
    </div>
  );
}