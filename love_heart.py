import math
import tkinter as tk


WORDS = [
    "AMOUR", "JE T'AIME", "MON COEUR", "TENDRESSE",
    "BONHEUR", "PASSION", "TOUJOURS", "MON ANGE",
]


class LoveHeart3D:
    def __init__(self, root):
        self.root = root
        self.root.title("Coeur d'amour 3D")
        self.root.configure(bg="#140817")
        self.canvas = tk.Canvas(
            root, width=900, height=700, bg="#140817", highlightthickness=0
        )
        self.canvas.pack()
        self.animation_step = 0.0
        self.angle_x = -0.15
        self.points = self.create_heart_points()
        self.animate()

    @staticmethod
    def create_heart_points():
        points = []
        for index in range(32):
            t = 2 * math.pi * index / 32
            x = 16 * math.sin(t) ** 3
            y = 13 * math.cos(t) - 5 * math.cos(2 * t)
            y -= 2 * math.cos(3 * t) + math.cos(4 * t)

            # Plusieurs profondeurs donnent un volume 3D au coeur.
            for depth in (-0.8, 0, 0.8):
                points.append((x, y, depth * 2.2, index))
        return points

    def project(self, x, y, z):
        cos_y, sin_y = math.cos(self.angle_y), math.sin(self.angle_y)
        rotated_x = x * cos_y - z * sin_y
        rotated_z = x * sin_y + z * cos_y

        cos_x, sin_x = math.cos(self.angle_x), math.sin(self.angle_x)
        rotated_y = y * cos_x - rotated_z * sin_x
        rotated_z = y * sin_x + rotated_z * cos_x

        distance = 42
        scale = 19 * distance / (distance - rotated_z)
        return 450 + rotated_x * scale, 360 - rotated_y * scale, scale

    def animate(self):
        self.canvas.delete("all")
        self.animation_step += 0.025
        # Le coeur se balance doucement au lieu de faire un tour complet.
        self.angle_y = 0.35 * math.sin(self.animation_step)

        projected = []
        for x, y, z, word_index in self.points:
            px, py, scale = self.project(x, y, z)
            projected.append((scale, px, py, word_index))

        # Dessiner du plus éloigné au plus proche pour simuler la profondeur.
        for scale, px, py, word_index in sorted(projected):
            word = WORDS[word_index % len(WORDS)]
            size = max(10, min(20, int(scale * 0.40)))
            color = "#ff4f91" if word_index % 3 else "#ffd1e1"
            self.canvas.create_text(
                px, py, text=word, fill=color,
                font=("Arial", size, "bold"), anchor="center"
            )

        self.canvas.create_text(
            452, 367, text="MARWA", fill="#c2185b",
            font=("Arial", 30, "bold")
        )
        self.canvas.create_text(
            450, 365, text="MARWA", fill="#ffffff",
            font=("Arial", 30, "bold")
        )
        self.canvas.create_text(
            450, 650, text="Mon amour pour toi tourne sans fin...",
            fill="#fff0f6", font=("Arial", 18, "italic")
        )
        self.root.after(30, self.animate)


if __name__ == "__main__":
    root = tk.Tk()
    LoveHeart3D(root)
    root.mainloop()