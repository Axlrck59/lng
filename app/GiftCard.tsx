"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Gift } from "./giftlist-utils";
import { saveReservation, getReservations, deleteReservation } from "./airtable-utils";

export default function GiftCard({ gift }: { gift: Gift }) {
  const [reservedBy, setReservedBy] = useState<string>("");
  const [isReserved, setIsReserved] = useState<boolean>(false);
  const [currentReservation, setCurrentReservation] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchReservation = async () => {
      try {
        const reservations = await getReservations();
        const reservation = reservations.find(r => r.giftId === gift.id);
        
        if (reservation && reservation.reservedBy) {
          setIsReserved(true);
          setCurrentReservation(reservation.reservedBy);
        } else {
          setIsReserved(false);
          setCurrentReservation("");
        }
      } catch (error) {
        console.error("Error loading reservation:", error);
        setIsReserved(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReservation();
  }, [gift.id]);

  const handleReservation = async () => {
    // Vérification du gift.id
    if (!gift?.id) {
      console.error("Gift ID is missing:", gift);
      alert("Erreur: Identifiant du cadeau manquant");
      return;
    }

    // Vérification du nom
    if (!reservedBy.trim()) {
      alert("Veuillez entrer votre nom");
      return;
    }

    setIsLoading(true);
    try {
      // Log pour debug
      console.log("Attempting to save reservation:", {
        giftId: gift.id,
        reservedBy: reservedBy
      });

      await saveReservation(gift.id, reservedBy);
      setIsReserved(true);
      setCurrentReservation(reservedBy);
      setReservedBy("");
    } catch (error) {
      console.error("Error saving reservation:", error);
      alert("Une erreur est survenue lors de la réservation");
      setIsReserved(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteReservation = async () => {
    if (!gift?.id) {
      console.error("Gift ID is missing:", gift);
      return;
    }

    const confirmed = window.confirm("Êtes-vous sûr de vouloir annuler cette réservation ?");
    if (!confirmed) return;

    setIsLoading(true);
    try {
      await deleteReservation(gift.id);
      setIsReserved(false);
      setCurrentReservation("");
    } catch (error) {
      console.error("Error deleting reservation:", error);
      alert("Une erreur est survenue lors de l'annulation de la réservation");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-[#18181b] rounded-xl shadow-lg p-4 flex flex-col items-center w-80">
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#18181b] rounded-xl shadow-lg p-4 flex flex-col items-center w-80 transition hover:scale-105 hover:shadow-2xl border border-gray-100 dark:border-zinc-800">
      <div className="w-full h-48 flex items-center justify-center mb-4 overflow-hidden rounded-lg bg-gray-50 dark:bg-zinc-900">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={gift.image}
          alt={gift.Objets}
          className="object-contain h-full w-full"
        />
      </div>
      <h2 className="text-lg font-semibold mb-2 text-center">{gift.Objets}</h2>
      <p className="text-blue-600 font-bold text-xl mb-2">{gift.prix} €</p>
      
      {isReserved && currentReservation ? (
        <div className="w-full space-y-2">
          <p className="text-green-600 font-medium mb-2 text-center">
            Réservé par {currentReservation}
          </p>
          <button
            onClick={handleDeleteReservation}
            disabled={isLoading}
            className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition disabled:bg-gray-400"
          >
            {isLoading ? "En cours..." : "Annuler la réservation"}
          </button>
        </div>
      ) : (
        <div className="w-full space-y-2">
          <input
            type="text"
            value={reservedBy}
            onChange={(e) => setReservedBy(e.target.value)}
            placeholder="Votre nom"
            className="w-full px-3 py-2 border rounded-md dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
            disabled={isLoading}
          />
          <button
            onClick={handleReservation}
            disabled={isLoading}
            className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition disabled:bg-gray-400"
          >
            {isLoading ? "En cours..." : "Réserver"}
          </button>
        </div>
      )}

      <a
        href={gift.Références}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      >
        Voir le cadeau
      </a>
    </div>
  );
}
