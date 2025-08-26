'use client';

import Image from 'next/image';
import HolographicCard from '@/components/HolographicCard';
import styles from './TicketDemo.module.scss';

export default function TicketDemo() {
  const ticketFrontContent = (
    <div className={styles.ticketLayout}>
      <div className={styles.leftSection}>
        <video
          className={styles.frontVideo}
          autoPlay
          loop
          muted
          playsInline
          width="100%"
          height="100%"
        >
          <source src="/monalisa.mp4" type="video/mp4" />
        </video>
      </div>

      <div className={styles.rightSection}>
        <div className={styles.eventTitle}>
          <h1>ESLEN & EMRE</h1>
          <h2>WEDDING AFTER PARTY</h2>
        </div>

        <div className={styles.eventDetails}>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>LOCATION</span>
            <span className={styles.detailValue}>CADDE HARE / ANKARA</span>
          </div>

          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>DATE & TIME</span>
            <span className={styles.detailValue}>30TH AUGUST 2025 • 11 PM</span>
          </div>

          <div className={styles.detailRow}>
            <div className={styles.djImages}>
              <Image
                src="/ilter.png"
                alt="DJ 1"
                className={styles.djImage}
                width={70}
                height={35}
              />
              <Image
                src="/emre.png"
                alt="DJ 2"
                className={styles.djImage}
                width={70}
                height={35}
              />
            </div>
          </div>
        </div>

        <div className={styles.ticketPass}>
          <div className={styles.equalizer}>
            {Array.from({ length: 40 }, (_, i) => {
              const randomDuration = Math.random() * 1 + 0.8; // 0.8s to 1.8s
              const randomDelay = Math.random() * 2; // 0s to 2s
              const randomHeight = Math.random() * 0.6 + 0.2; // 20% to 80%
              return (
                <div
                  key={`front-equalizer-${i}-${randomDuration}-${randomDelay}`}
                  className={styles.bar}
                  style={
                    {
                      animationDuration: `${randomDuration}s`,
                      animationDelay: `${randomDelay}s`,
                      '--random-height': `${randomHeight * 10}%`,
                    } as React.CSSProperties
                  }
                ></div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );

  const ticketBackContent = (
    <div className={styles.ticketLayout}>
      <div className={styles.backRightSection}>
        <div className={styles.backTicketPass}>
          <div className={styles.equalizer}>
            {Array.from({ length: 40 }, (_, i) => {
              const randomDuration = Math.random() * 1 + 0.8; // 0.8s to 1.8s
              const randomDelay = Math.random() * 2; // 0s to 2s
              const randomHeight = Math.random() * 0.6 + 0.2; // 20% to 80%
              return (
                <div
                  key={i}
                  className={styles.bar}
                  style={
                    {
                      animationDuration: `${randomDuration}s`,
                      animationDelay: `${randomDelay}s`,
                      '--random-height': `${randomHeight * 1}%`,
                    } as React.CSSProperties
                  }
                ></div>
              );
            })}
          </div>
        </div>

        <div className={styles.eventTitle}>
          <h3>PARTY RULES</h3>
        </div>

        <div className={styles.partyRules}>
          <div className={styles.ruleItem}>
            <span className={styles.ruleBullet}>•</span>
            <span className={styles.ruleText}>
              Love us because we love you - but also because we&apos;re awesome
            </span>
          </div>

          <div className={styles.ruleItem}>
            <span className={styles.ruleBullet}>•</span>
            <span className={styles.ruleText}>
              Drink responsibly, drive responsibly - we have great days ahead
              and we want you there!
            </span>
          </div>

          <div className={styles.ruleItem}>
            <span className={styles.ruleBullet}>•</span>
            <span className={styles.ruleText}>
              Dance like nobody&apos;s watching (even though everyone is
              watching)
            </span>
          </div>

          <div className={styles.ruleItem}>
            <span className={styles.ruleBullet}>•</span>
            <span className={styles.ruleText}>Enjoy to the MAXIMUM!</span>
          </div>

          <div className={styles.ruleItem}>
            <span className={styles.ruleBullet}>•</span>
            <span className={styles.ruleText}>
              Here is a
              <a
                href="https://open.spotify.com/playlist/37i9dQZF1E8Ma39qNpzr3u?si=EQVWEdcAR360J5fL0BLNdQ"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.spotifyLink}
              >
                {' '}
                playlist{' '}
              </a>
              for the road!
            </span>
          </div>
        </div>
      </div>
      <div className={styles.backLeftSection}>
        <video
          className={styles.backVideo}
          autoPlay
          loop
          muted
          playsInline
          width="100%"
          height="100%"
        >
          <source src="/eslenemre.mp4" type="video/mp4" />
        </video>
      </div>
    </div>
  );

  return (
    <div className={styles['demo-container']}>
      <HolographicCard
        backContent={ticketBackContent}
        width="900px"
        height="350px"
      >
        {ticketFrontContent}
      </HolographicCard>
    </div>
  );
}
