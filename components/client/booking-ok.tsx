import React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog'
import { Button } from './ui/button'
interface BookingOkProps {
    restType: 'circuit' | 'car';
  showConfirmDialog: boolean;
  setShowConfirmDialog: (value: boolean) => void;
  pendingFormData: any;
  loading: boolean;
  handleCancelReservation: () => void;
  handleConfirmReservation: () => void;
  getCircuitName?: (circuitId: string) => string;
  getVehicleName?: (vehicleId: string) => string;
  formatDate: (dateStr: string) => string;
}

const BookingOk = ({
    restType,
  showConfirmDialog,
  setShowConfirmDialog,
  pendingFormData,
  loading,
  handleCancelReservation,
  handleConfirmReservation,
  getCircuitName,
  getVehicleName,
  formatDate,
}: BookingOkProps) => {
  return (
    <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Confirmer votre réservation</DialogTitle>
            <DialogDescription>
              Veuillez vérifier les informations de votre réservation avant de
              confirmer.
            </DialogDescription>
          </DialogHeader>

          {pendingFormData && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Circuit :</strong>
                  <p className="text-muted-foreground">
                    {/* {getCircuitName(pendingFormData.circuit)} */}
                    {restType === "circuit"
                      ? getCircuitName?.(pendingFormData.circuit)
                      : getVehicleName?.(pendingFormData.vehicle)}
                  </p>
                </div>
                <div>
                  <strong>Durée :</strong>
                  <p className="text-muted-foreground">
                    {pendingFormData.duration} jour
                    {parseInt(pendingFormData.duration) > 1 ? "s" : ""}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Client :</strong>
                  <p className="text-muted-foreground">
                    {pendingFormData.prenom} {pendingFormData.nom}
                  </p>
                </div>
                <div>
                  <strong>Email :</strong>
                  <p className="text-muted-foreground">
                    {pendingFormData.email}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <strong>Personnes :</strong>
                  <p className="text-muted-foreground">
                    {pendingFormData.personnes}
                  </p>
                </div>
                <div>
                  <strong>Adultes :</strong>
                  <p className="text-muted-foreground">
                    {pendingFormData.nbrAdult}
                  </p>
                </div>
                <div>
                  <strong>Enfants :</strong>
                  <p className="text-muted-foreground">
                    {pendingFormData.nbrChild}
                  </p>
                </div>
              </div>

              {pendingFormData.startDate && (
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Date de début :</strong>
                    <p className="text-muted-foreground">
                      {formatDate(pendingFormData.startDate)}
                    </p>
                  </div>
                  <div>
                    <strong>Date de fin :</strong>
                    <p className="text-muted-foreground">
                      {formatDate(pendingFormData.endDate)}
                    </p>
                  </div>
                </div>
              )}

              {pendingFormData.preferences && (
                <div className="text-sm">
                  <strong>Préférences :</strong>
                  <p className="text-muted-foreground mt-1">
                    {pendingFormData.preferences}
                  </p>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleCancelReservation}
              disabled={loading}
            >
              Annuler
            </Button>
            <Button
              onClick={handleConfirmReservation}
              disabled={loading}
              className="hover-glow"
            >
              {loading ? "Confirmation..." : "Confirmer la réservation"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
  )
}

export default BookingOk