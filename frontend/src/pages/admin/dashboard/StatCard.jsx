import { Paper, Typography, Box } from "@mui/material";

function StatCard({ label, value, color, icon }) {
    return (
        <Paper
            elevation={4}
            sx={{
                padding: 3,
                borderRadius: 3,
                position: "relative",
                overflow: "hidden",
                transition: "0.3s",
                "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: 8
                }
            }}
        >
            <Box
                sx={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    color: color,
                    opacity: 0.2
                }}
            >
                {icon}
            </Box>

            <Typography variant="subtitle2" color="textSecondary">
                {label}
            </Typography>

            <Typography
                sx={{
                    fontWeight: "bold",
                    color: color,
                    mt: 1,

                    // tránh tràn text khi giá trị quá lớn
                    fontSize: "clamp(1.2rem, 2vw, 2rem)",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis"
                }}
            >
                {value}
            </Typography>
        </Paper>
    );
}

export default StatCard;