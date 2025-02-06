// import React from 'react';
// import { Tournament } from '@/interfaces';

// interface TournamentStartInfoProps {
//   tournament: Tournament;
// }

// const TournamentStartInfo: React.FC<TournamentStartInfoProps> = ({ tournament }) => {
//   const { startDate, endDate, tournamentName } = tournament;

//   // Konvertera datumen till Date-objekt
//   const start = new Date(startDate);
//   const end = new Date(endDate);

//   // Kontrollera om datumkonverteringen lyckades
//   if (isNaN(start.getTime()) || isNaN(end.getTime())) {
//     return <p>Ogiltiga datum för turneringen.</p>;
//   }

//   // Formatera datum för visning
//   const formatDate = (date: Date) => date.toLocaleDateString('sv-SE', { year: 'numeric', month: 'long', day: 'numeric' });

//   return (
//     <section className="tournament-start-info">
//       <h2>{tournamentName}</h2>
//       <p>
//         Turneringen spelas från <strong>{formatDate(start)}</strong> till{' '}
//         <strong>{formatDate(end)}</strong>.
//       </p>
//     </section>
//   );
// };

// export default TournamentStartInfo;
