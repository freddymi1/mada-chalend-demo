"use client";

import { useTheme } from "@/src/hooks/useTheme";
import {
  ArrowLeft,
  User,
  FileText,
  Loader2,
  ImageIcon,
  MessageCircle,
  Send,
  X,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useCiBlog } from "../providers/client/ClBlogProvider";
import { useTranslations } from "next-intl";
import { useAuthClient } from "@/src/hooks/useAuthClient";
import { IComment } from "@/src/domain/entities/comment";

interface CommentSectionState {
  type: "blog" | "article";
  id: string;
}

interface CommentItemProps {
  comment: IComment;
  type: "blog" | "article";
  itemId: string;
  isDark: boolean;
  onReply: (comment: IComment) => void;
}

interface CommentSectionProps {
  type: "blog" | "article";
  itemId: string;
  title: string;
  isDark: boolean;
  isAuthenticated: boolean;
  comments: IComment[];
  showCommentSection: CommentSectionState | null;
  commentText: string;
  replyTo: IComment | null;
  onCommentClick: (type: "blog" | "article", itemId: string) => void;
  onCloseSection: () => void;
  onCommentTextChange: (text: string) => void;
  onSubmitComment: (type: "blog" | "article", itemId: string) => void;
  onReply: (comment: IComment) => void;
  onCancelReply: () => void;
}

// Déplacer CommentItem en dehors du composant principal
const CommentItem: React.FC<CommentItemProps> = React.memo(({ comment, type, itemId, isDark, onReply }) => (
  <div className="space-y-3">
    <div
      className={`rounded-lg p-4 ${
        isDark ? "bg-gray-700" : "bg-gray-50"
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
            isDark ? "bg-indigo-900" : "bg-indigo-100"
          }`}
        >
          <User
            className={`w-5 h-5 ${
              isDark ? "text-indigo-300" : "text-indigo-600"
            }`}
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h4
              className={`font-semibold ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              {comment.user?.username}
            </h4>
            <span
              className={`text-xs ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}
            >
              {new Date(comment.createdAt).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
          <p
            className={`text-sm mb-2 break-words ${
              isDark ? "text-gray-300" : "text-gray-700"
            }`}
          >
            {comment.content}
          </p>
          <button
            onClick={() => onReply(comment)}
            className={`text-xs font-medium ${
              isDark
                ? "text-indigo-400 hover:text-indigo-300"
                : "text-indigo-600 hover:text-indigo-700"
            }`}
          >
            Répondre
          </button>
        </div>
      </div>
    </div>

    {comment.replies && comment.replies.length > 0 && (
      <div className="ml-12 space-y-3">
        {comment.replies.map((reply) => (
          <CommentItem
            key={reply.id}
            comment={reply}
            type={type}
            itemId={itemId}
            isDark={isDark}
            onReply={onReply}
          />
        ))}
      </div>
    )}
  </div>
));

CommentItem.displayName = "CommentItem";

// Déplacer CommentSection en dehors du composant principal
const CommentSection: React.FC<CommentSectionProps> = React.memo(({
  type,
  itemId,
  title,
  isDark,
  isAuthenticated,
  comments,
  showCommentSection,
  commentText,
  replyTo,
  onCommentClick,
  onCloseSection,
  onCommentTextChange,
  onSubmitComment,
  onReply,
  onCancelReply,
}) => {
  const itemComments = comments.filter(
    (comment) =>
      (type === "blog" && comment.blogId === itemId) ||
      (type === "article" && comment.articleId === itemId)
  );
  
  const isOpen =
    showCommentSection?.type === type && showCommentSection?.id === itemId;

  return (
    <div className="mt-6">
      <button
        onClick={() => onCommentClick(type, itemId)}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
          isDark
            ? "bg-indigo-900 text-indigo-300 hover:bg-indigo-800"
            : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
        }`}
      >
        <MessageCircle className="w-5 h-5" />
        Commentaires ({itemComments.length})
      </button>

      {isOpen && (
        <div
          className={`mt-4 rounded-xl p-6 ${
            isDark ? "bg-gray-800" : "bg-white"
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <h3
              className={`text-xl font-bold ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              Commentaires sur {title}
            </h3>
            <button
              onClick={onCloseSection}
              className={`p-1 rounded-lg transition-colors ${
                isDark
                  ? "hover:bg-gray-700 text-gray-400"
                  : "hover:bg-gray-100 text-gray-600"
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Comment Input */}
          <div className="mb-6">
            {replyTo && (
              <div
                className={`mb-3 p-3 rounded-lg flex items-center justify-between ${
                  isDark ? "bg-gray-700" : "bg-gray-100"
                }`}
              >
                <span
                  className={`text-sm ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Répondre à{" "}
                  <strong>{replyTo.user?.username}</strong>
                </span>
                <button
                  onClick={onCancelReply}
                  className={`p-1 rounded ${
                    isDark
                      ? "hover:bg-gray-600 text-gray-400"
                      : "hover:bg-gray-200 text-gray-600"
                  }`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
            <div className="flex gap-3">
              <textarea
                value={commentText}
                onChange={(e) => onCommentTextChange(e.target.value)}
                placeholder="Écrivez votre commentaire..."
                rows={3}
                className={`flex-1 px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none ${
                  isDark
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    : "bg-white border-gray-200 text-gray-900 placeholder-gray-500"
                }`}
              />
              <button
                onClick={() => onSubmitComment(type, itemId)}
                disabled={!commentText.trim()}
                className={`px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 h-fit ${
                  commentText.trim()
                    ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                <Send className="w-5 h-5" />
                Envoyer
              </button>
            </div>
          </div>

          {/* Comments List */}
          <div className="space-y-4">
            {itemComments.length === 0 ? (
              <p
                className={`text-center py-8 ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Aucun commentaire pour le moment. Soyez le premier à
                commenter !
              </p>
            ) : (
              itemComments
                .filter((c) => !c.parentId)
                .map((comment) => (
                  <CommentItem
                    key={comment.id}
                    comment={comment}
                    type={type}
                    itemId={itemId}
                    isDark={isDark}
                    onReply={onReply}
                  />
                ))
            )}
          </div>
        </div>
      )}
    </div>
  );
});

CommentSection.displayName = "CommentSection";

const CiBlogDetailScreen = () => {
  const { isDark } = useTheme();
  const router = useRouter();
  const params = useParams();
  const t = useTranslations("lng");
  const id = params?.id;

  const { blogDetail, getBlogById, isLoading } = useCiBlog();
  const { user, isAuthenticated } = useAuthClient();

  // States for comments
  const [comments, setComments] = useState<IComment[]>([]);
  const [showCommentSection, setShowCommentSection] = useState<CommentSectionState | null>(null);
  const [commentText, setCommentText] = useState<string>("");
  const [replyTo, setReplyTo] = useState<IComment | null>(null);

  useEffect(() => {
    if (id) {
      getBlogById(id.toString());
    }
  }, [id]);

  const handleCommentClick = (type: "blog" | "article", itemId: string) => {
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }
    setShowCommentSection({ type, id: itemId });
    setReplyTo(null);
  };

  const handleSubmitComment = (type: "blog" | "article", itemId: string) => {
    if (!commentText.trim() || !user) return;

    const newComment: IComment = {
      id: `temp-${Date.now()}`,
      content: commentText,
      userId: user.id,
      user: {
        id: user.id,
        username: user.username || "Anonymous",
        email: user.email,
        role: user.role || "user",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      parentId: replyTo?.id || undefined,
      blogId: type === "blog" ? itemId : undefined,
      articleId: type === "article" ? itemId : undefined,
      isApproved: true,
      replies: [],
    };

    setComments((prev) => {
      if (replyTo) {
        return prev.map((comment) => {
          if (comment.id === replyTo.id) {
            return {
              ...comment,
              replies: [...(comment.replies || []), newComment],
            };
          }
          return comment;
        });
      }
      return [...prev, newComment];
    });

    setCommentText("");
    setReplyTo(null);
  };

  const handleReply = (comment: IComment) => {
    setReplyTo(comment);
  };

  const handleCloseSection = () => {
    setShowCommentSection(null);
  };

  const handleCommentTextChange = (text: string) => {
    setCommentText(text);
  };

  const handleCancelReply = () => {
    setReplyTo(null);
  };

  if (isLoading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          isDark ? "bg-gray-900" : "bg-slate-50"
        }`}
      >
        <Loader2
          className={`w-8 h-8 animate-spin ${
            isDark ? "text-indigo-400" : "text-indigo-600"
          }`}
        />
      </div>
    );
  }

  if (!blogDetail) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          isDark ? "bg-gray-900" : "bg-slate-50"
        }`}
      >
        <div className="text-center">
          <FileText
            className={`w-16 h-16 mx-auto mb-4 ${
              isDark ? "text-gray-600" : "text-gray-400"
            }`}
          />
          <h2
            className={`text-2xl font-bold mb-2 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            Blog introuvable
          </h2>
          <button
            onClick={() => router.push("/admin/blogs")}
            className="mt-4 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
          >
            Retour à la liste
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDark
          ? "bg-gradient-to-br from-gray-900 to-gray-800"
          : "bg-gradient-to-br from-slate-50 to-indigo-50"
      }`}
    >
      <div className="px-6 py-8 container mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/blog")}
              className={`p-2 rounded-lg transition-colors ${
                isDark
                  ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="text-xl lg:text-4xl font-bold mb-2">
              {t("blog.details.title")}
            </div>
          </div>
        </div>

        {/* Main Image */}
        {blogDetail.image && (
          <div className="mb-8 rounded-2xl overflow-hidden shadow-2xl">
            <img
              src={blogDetail.image}
              alt={blogDetail.title}
              className="w-full h-96 object-cover"
            />
          </div>
        )}

        {/* Blog Header Card */}
        <div
          className={`rounded-xl p-8 shadow-lg mb-8 ${
            isDark ? "bg-gray-800" : "bg-white"
          }`}
        >
          {/* Title */}
          <h1
            className={`text-4xl font-bold mb-4 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            {blogDetail.title}
          </h1>

          {/* Subtitle */}
          {blogDetail.subtitle && (
            <p
              className={`text-xl mb-6 ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              {blogDetail.subtitle}
            </p>
          )}

          {/* Meta Information */}
          <div className="flex flex-wrap gap-4 mb-6">
            {blogDetail.author && (
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  isDark ? "bg-gray-700" : "bg-gray-100"
                }`}
              >
                <User
                  className={`w-4 h-4 ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                />
                <span
                  className={`text-sm font-medium ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {blogDetail.author}
                </span>
              </div>
            )}

            {blogDetail.articles && (
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  isDark ? "bg-gray-700" : "bg-gray-100"
                }`}
              >
                <FileText
                  className={`w-4 h-4 ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                />
                <span
                  className={`text-sm font-medium ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {blogDetail.articles.length} article
                  {blogDetail.articles.length > 1 ? "s" : ""}
                </span>
              </div>
            )}
          </div>

          {/* Description */}
          {blogDetail.description && (
            <div>
              <h2
                className={`text-xl font-semibold mb-3 ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {t("blog.details.description")}
              </h2>
              <p
                className={`text-lg leading-relaxed whitespace-pre-wrap ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                {blogDetail.description}
              </p>
            </div>
          )}

          {/* Blog Comments Section */}
          <CommentSection
            type="blog"
            itemId={blogDetail.id}
            title="ce blog"
            isDark={isDark}
            isAuthenticated={isAuthenticated}
            comments={comments}
            showCommentSection={showCommentSection}
            commentText={commentText}
            replyTo={replyTo}
            onCommentClick={handleCommentClick}
            onCloseSection={handleCloseSection}
            onCommentTextChange={handleCommentTextChange}
            onSubmitComment={handleSubmitComment}
            onReply={handleReply}
            onCancelReply={handleCancelReply}
          />
        </div>

        {/* Articles Section */}
        {blogDetail.articles && blogDetail.articles.length > 0 && (
          <div>
            <h2
              className={`text-3xl font-bold mb-6 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              {t("blog.details.article")}
            </h2>

            <div className="space-y-6">
              {blogDetail.articles.map((article: any, index: number) => (
                <div
                  key={article.id}
                  className={`rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl ${
                    isDark ? "bg-gray-800" : "bg-white"
                  }`}
                >
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Article Image */}
                    <div
                      className={`relative h-64 md:h-auto ${
                        index % 2 === 0 ? "md:order-1" : "md:order-2"
                      }`}
                    >
                      {article.image ? (
                        <img
                          src={article.image}
                          alt={article.title || `Article ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div
                          className={`w-full h-full flex items-center justify-center ${
                            isDark
                              ? "bg-gray-700"
                              : "bg-gradient-to-br from-indigo-100 to-purple-100"
                          }`}
                        >
                          <ImageIcon
                            className={`w-16 h-16 ${
                              isDark ? "text-gray-600" : "text-gray-400"
                            }`}
                          />
                        </div>
                      )}
                      {article.imageDescription && (
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-3">
                          <p className="text-sm">{article.imageDescription}</p>
                        </div>
                      )}
                    </div>

                    {/* Article Content */}
                    <div
                      className={`p-6 flex flex-col justify-center ${
                        index % 2 === 0 ? "md:order-2" : "md:order-1"
                      }`}
                    >
                      {/* Article Number Badge */}
                      <div className="mb-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                            isDark
                              ? "bg-indigo-900 text-indigo-300"
                              : "bg-indigo-100 text-indigo-700"
                          }`}
                        >
                          Article {index + 1}
                        </span>
                      </div>

                      {/* Article Title */}
                      {article.title && (
                        <h3
                          className={`text-2xl font-bold mb-4 ${
                            isDark ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {article.title}
                        </h3>
                      )}

                      {/* Article Caption */}
                      {article.caption && (
                        <p
                          className={`text-lg leading-relaxed whitespace-pre-wrap ${
                            isDark ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          {article.caption}
                        </p>
                      )}

                      
                    </div>
                  </div>
                  {/* Article Comments Section */}
                      <CommentSection
                        type="article"
                        itemId={article.id}
                        title={article.title || `l'article ${index + 1}`}
                        isDark={isDark}
                        isAuthenticated={isAuthenticated}
                        comments={comments}
                        showCommentSection={showCommentSection}
                        commentText={commentText}
                        replyTo={replyTo}
                        onCommentClick={handleCommentClick}
                        onCloseSection={handleCloseSection}
                        onCommentTextChange={handleCommentTextChange}
                        onSubmitComment={handleSubmitComment}
                        onReply={handleReply}
                        onCancelReply={handleCancelReply}
                      />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Articles State */}
        {(!blogDetail.articles || blogDetail.articles.length === 0) && (
          <div
            className={`rounded-xl p-12 text-center ${
              isDark ? "bg-gray-800" : "bg-white"
            }`}
          >
            <FileText
              className={`w-16 h-16 mx-auto mb-4 ${
                isDark ? "text-gray-600" : "text-gray-400"
              }`}
            />
            <h3
              className={`text-xl font-semibold mb-2 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              {t("blog.details.noArticle")}
            </h3>
            <p
              className={`mb-6 ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Ce blog ne contient pas encore d'articles
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CiBlogDetailScreen;